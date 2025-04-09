"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureExchange = exports.ensureNotBanned = exports.validateBinaryProfit = exports.processBinaryRewards = exports.getBinaryOrdersByStatus = exports.getBinaryOrder = exports.baseBinaryOrderSchema = void 0;
const db_1 = require("@b/db");
const affiliate_1 = require("@b/utils/affiliate");
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const utils_1 = require("@b/api/exchange/utils");
const schema_1 = require("@b/utils/schema");
const error_1 = require("@b/utils/error");
exports.baseBinaryOrderSchema = {
    id: (0, schema_1.baseStringSchema)("ID of the binary order", undefined, undefined, false, undefined, "uuid"),
    userId: (0, schema_1.baseStringSchema)("User ID associated with the order"),
    symbol: (0, schema_1.baseStringSchema)("Trading symbol"),
    price: (0, schema_1.baseNumberSchema)("Entry price of the order"),
    amount: (0, schema_1.baseNumberSchema)("Amount of the order"),
    profit: (0, schema_1.baseNumberSchema)("Profit from the order"),
    side: (0, schema_1.baseStringSchema)("Side of the order (e.g., BUY, SELL)"),
    type: (0, schema_1.baseStringSchema)("Type of order (e.g., LIMIT, MARKET)"),
    barrier: (0, schema_1.baseNumberSchema)("Barrier price of the order", true),
    strikePrice: (0, schema_1.baseNumberSchema)("Strike price of the order", true),
    payoutPerPoint: (0, schema_1.baseNumberSchema)("Payout per point of the order", true),
    status: (0, schema_1.baseStringSchema)("Status of the order (e.g., OPEN, CLOSED)"),
    isDemo: (0, schema_1.baseBooleanSchema)("Whether the order is a demo"),
    closedAt: (0, schema_1.baseDateTimeSchema)("Time when the order was closed", true),
    closePrice: (0, schema_1.baseNumberSchema)("Price at which the order was closed"),
    createdAt: (0, schema_1.baseDateTimeSchema)("Creation date of the order"),
    updatedAt: (0, schema_1.baseDateTimeSchema)("Last update date of the order", true),
};
async function getBinaryOrder(userId, id) {
    const response = await db_1.models.binaryOrder.findOne({
        where: {
            id,
            userId,
        },
    });
    if (!response) {
        throw new Error(`Binary order with ID ${id} not found`);
    }
    return response.get({ plain: true });
}
exports.getBinaryOrder = getBinaryOrder;
async function getBinaryOrdersByStatus(status) {
    return (await db_1.models.binaryOrder.findAll({
        where: { status },
    }));
}
exports.getBinaryOrdersByStatus = getBinaryOrdersByStatus;
// If you want to process rewards, call it here:
// await processBinaryRewards(order.userId, order.amount, order.status, order.symbol.split("/")[1]);
async function processBinaryRewards(userId, amount, status, currency) {
    let rewardType;
    if (status === "WIN") {
        rewardType = "BINARY_WIN";
    }
    else if (status === "LOSS" || status === "DRAW") {
        rewardType = "BINARY_TRADE_VOLUME";
    }
    await (0, affiliate_1.processRewards)(userId, amount, rewardType, currency);
}
exports.processBinaryRewards = processBinaryRewards;
function validateBinaryProfit(value) {
    const profit = parseFloat(value || "87");
    if (isNaN(profit) || profit < 0)
        return 87; // default profit margin
    return profit;
}
exports.validateBinaryProfit = validateBinaryProfit;
/**
 * Ensures that the user is not banned. Throws a 503 error if the service is unavailable due to a ban.
 */
async function ensureNotBanned() {
    const unblockTime = await (0, utils_1.loadBanStatus)();
    if (await (0, utils_1.handleBanStatus)(unblockTime)) {
        throw (0, error_1.createError)({
            statusCode: 503,
            message: "Service temporarily unavailable. Please try again later.",
        });
    }
}
exports.ensureNotBanned = ensureNotBanned;
/**
 * Attempts to start the exchange multiple times before giving up.
 */
async function ensureExchange(attempts = 3, delayMs = 500) {
    for (let i = 0; i < attempts; i++) {
        const exchange = await exchange_1.default.startExchange();
        if (exchange)
            return exchange;
        if (i < attempts - 1)
            await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    throw (0, error_1.createError)({
        statusCode: 503,
        message: "Service temporarily unavailable. Please try again later.",
    });
}
exports.ensureExchange = ensureExchange;
