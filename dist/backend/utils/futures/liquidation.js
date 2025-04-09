"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLiquidationNotificationEmail = exports.sendPartialLiquidationNotificationEmail = exports.sendLiquidationWarningEmail = exports.sendWarningEmail = exports.liquidatePosition = exports.checkForLiquidation = void 0;
const blockchain_1 = require("@b/utils/eco/blockchain");
const client_1 = __importStar(require("@b/utils/eco/scylla/client"));
const emails_1 = require("../emails");
const wallet_1 = require("@b/utils/eco/wallet");
const db_1 = require("@b/db");
const ws_1 = require("./ws");
const calculateMargin = (position, matchedPrice) => {
    const currentPriceBigInt = (0, blockchain_1.toBigIntFloat)(matchedPrice); // Scale up by 18
    const entryPriceBigInt = position.entryPrice;
    const leverageBigInt = BigInt(position.leverage);
    // Ensure entryPriceBigInt is not zero to avoid division by zero
    if (entryPriceBigInt === BigInt(0)) {
        throw new Error("Entry price cannot be zero");
    }
    // Calculate price difference based on the side of the position
    const priceDifferenceBigInt = position.side === "BUY"
        ? currentPriceBigInt - entryPriceBigInt
        : entryPriceBigInt - currentPriceBigInt;
    const entryPriceWithLeverageBigInt = entryPriceBigInt / leverageBigInt;
    const marginBigInt = (priceDifferenceBigInt * BigInt(1000000000000000000)) /
        entryPriceWithLeverageBigInt;
    // Convert margin back to number for the result
    const margin = Number(marginBigInt) / 1000000000000000000;
    return margin;
};
const checkForLiquidation = async (position, matchedPrice) => {
    const margin = calculateMargin(position, matchedPrice);
    const partialLiquidationThreshold = -0.8; // 80% loss for partial liquidation
    const fullLiquidationThreshold = -1.0; // 100% loss for full liquidation
    if (margin <= partialLiquidationThreshold &&
        margin > fullLiquidationThreshold) {
        await (0, exports.liquidatePosition)(position, matchedPrice, true); // Partial liquidation
    }
    else if (margin <= fullLiquidationThreshold) {
        await (0, exports.liquidatePosition)(position, matchedPrice); // Full liquidation
    }
};
exports.checkForLiquidation = checkForLiquidation;
const liquidatePosition = async (position, matchedPrice, partial = false) => {
    // Calculate the amount to liquidate
    const amountToLiquidate = partial
        ? (position.amount * BigInt(80)) / BigInt(100) // Liquidate 80% of the position in partial liquidation
        : position.amount;
    // Update the position in the database
    await client_1.default.execute(`UPDATE ${client_1.scyllaFuturesKeyspace}.position SET amount = ?, status = ? WHERE "userId" = ? AND id = ?`, [
        partial ? amountToLiquidate.toString() : "0",
        partial ? "PARTIALLY_LIQUIDATED" : "LIQUIDATED",
        position.userId,
        position.id,
    ], { prepare: true });
    // Update the user's wallet balance
    const wallet = await (0, wallet_1.getWalletByUserIdAndCurrency)(position.userId, position.symbol.split("/")[1]);
    if (wallet) {
        const amountToRefund = (0, blockchain_1.fromBigInt)(amountToLiquidate) * (0, blockchain_1.fromBigInt)(position.entryPrice);
        await (0, wallet_1.updateWalletBalance)(wallet, amountToRefund, "add");
    }
    // Broadcast position update
    await (0, ws_1.handlePositionBroadcast)(position);
    // Send liquidation email
    const user = await db_1.models.user.findOne({ where: { id: position.userId } });
    if (user && user.email) {
        if (partial) {
            await sendPartialLiquidationNotificationEmail(user, position, matchedPrice);
        }
        else {
            await sendLiquidationNotificationEmail(user, position, matchedPrice);
        }
    }
};
exports.liquidatePosition = liquidatePosition;
const sendWarningEmail = async (userId, position, margin, matchedPrice) => {
    const user = await db_1.models.user.findOne({ where: { id: userId } });
    if (user && user.email) {
        await sendLiquidationWarningEmail(user, position, margin, matchedPrice);
    }
};
exports.sendWarningEmail = sendWarningEmail;
async function sendLiquidationWarningEmail(user, position, margin, matchedPrice) {
    const emailType = "LiquidationWarning";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        SYMBOL: position.symbol,
        MARGIN: margin.toFixed(2),
        LEVERAGE: position.leverage,
        ENTRY_PRICE: (0, blockchain_1.fromBigInt)(position.entryPrice),
        CURRENT_PRICE: matchedPrice,
    };
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendLiquidationWarningEmail = sendLiquidationWarningEmail;
async function sendPartialLiquidationNotificationEmail(user, position, matchedPrice) {
    const emailType = "PartialLiquidationNotification";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        SYMBOL: position.symbol,
        LEVERAGE: position.leverage,
        ENTRY_PRICE: (0, blockchain_1.fromBigInt)(position.entryPrice),
        CURRENT_PRICE: matchedPrice,
    };
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendPartialLiquidationNotificationEmail = sendPartialLiquidationNotificationEmail;
async function sendLiquidationNotificationEmail(user, position, matchedPrice) {
    const emailType = "LiquidationNotification";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        SYMBOL: position.symbol,
        LEVERAGE: position.leverage,
        ENTRY_PRICE: (0, blockchain_1.fromBigInt)(position.entryPrice),
        CURRENT_PRICE: matchedPrice,
    };
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendLiquidationNotificationEmail = sendLiquidationNotificationEmail;
