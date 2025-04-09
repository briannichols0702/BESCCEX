"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processInternalTransfer = exports.parseAddresses = exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
const wallet_1 = require("@b/utils/eco/wallet");
const utils_1 = require("./utils");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Performs a transfer transaction",
    description: "Initiates a transfer transaction for the currently authenticated user",
    operationId: "createTransfer",
    tags: ["Finance", "Transfer"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        fromType: {
                            type: "string",
                            description: "The type of wallet to transfer from",
                        },
                        toType: {
                            type: "string",
                            description: "The type of wallet to transfer to",
                        },
                        fromCurrency: {
                            type: "string",
                            description: "The currency to transfer from",
                        },
                        toCurrency: {
                            type: "string",
                            description: "The currency to transfer to",
                            nullable: true,
                        },
                        amount: { type: "number", description: "Amount to transfer" },
                        transferType: {
                            type: "string",
                            description: "Type of transfer: client or wallet",
                        },
                        clientId: {
                            type: "string",
                            description: "Client UUID for client transfers",
                            nullable: true,
                        },
                    },
                    required: [
                        "fromType",
                        "toType",
                        "amount",
                        "fromCurrency",
                        "transferType",
                    ],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Transfer transaction initiated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", description: "Success message" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Withdraw Method"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { fromType, toType, amount, transferType, clientId, fromCurrency, toCurrency, } = body;
    if (toCurrency === "Select a currency") {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Please select a target currency",
        });
    }
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk)
        throw (0, error_1.createError)({ statusCode: 404, message: "User not found" });
    const fromWallet = await db_1.models.wallet.findOne({
        where: {
            userId: user.id,
            currency: fromCurrency,
            type: fromType,
        },
    });
    if (!fromWallet)
        throw (0, error_1.createError)({ statusCode: 404, message: "Wallet not found" });
    let toWallet = null;
    let toUser = null;
    if (transferType === "client") {
        ({ toWallet, toUser } = await handleClientTransfer(clientId, fromCurrency, fromType));
    }
    else {
        toWallet = await handleWalletTransfer(user.id, fromType, toType, toCurrency);
    }
    const parsedAmount = parseFloat(amount);
    if (fromWallet.balance < parsedAmount)
        throw (0, error_1.createError)(400, "Insufficient balance");
    const currencyData = await (0, utils_1.getCurrencyData)(fromType, fromCurrency);
    if (!currencyData)
        throw (0, error_1.createError)(400, "Invalid wallet type");
    const transaction = await performTransaction(transferType, fromWallet, toWallet, parsedAmount, fromCurrency, toCurrency, user.id, toUser === null || toUser === void 0 ? void 0 : toUser.id, fromType, toType, currencyData);
    if (transferType === "client") {
        const userPk = await db_1.models.user.findByPk(user.id);
        try {
            await (0, utils_1.sendTransferEmails)(userPk, toUser, fromWallet, toWallet, parsedAmount, transaction);
        }
        catch (error) {
            console.error("Failed to send transfer emails:", error);
        }
    }
    return {
        message: "Transfer initiated successfully",
        fromTransfer: transaction.fromTransfer,
        toTransfer: transaction.toTransfer,
        fromType,
        toType,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
    };
};
async function handleClientTransfer(clientId, currency, fromType) {
    if (!clientId)
        throw (0, error_1.createError)({ statusCode: 400, message: "Client ID is required" });
    const toUser = await db_1.models.user.findByPk(clientId);
    if (!toUser)
        throw (0, error_1.createError)({ statusCode: 404, message: "Target user not found" });
    let toWallet;
    if (fromType === "ECO") {
        toWallet = await (0, wallet_1.getWalletByUserIdAndCurrency)(clientId, currency);
    }
    else {
        toWallet = await db_1.models.wallet.findOne({
            where: { userId: clientId, currency, type: fromType },
        });
        if (!toWallet) {
            toWallet = await db_1.models.wallet.create({
                userId: clientId,
                currency,
                type: fromType,
                status: true,
            });
        }
    }
    if (!toWallet)
        throw (0, error_1.createError)({ statusCode: 404, message: "Target wallet not found" });
    return { toWallet, toUser };
}
async function handleWalletTransfer(userId, fromType, toType, toCurrency) {
    if (fromType === toType)
        throw (0, error_1.createError)(400, "Cannot transfer to the same wallet type");
    const validTransfers = {
        FIAT: ["SPOT", "ECO"],
        SPOT: ["FIAT", "ECO"],
        ECO: ["FIAT", "SPOT", "FUTURES"],
        FUTURES: ["ECO"],
    };
    if (!validTransfers[fromType] || !validTransfers[fromType].includes(toType))
        throw (0, error_1.createError)(400, "Invalid wallet type transfer");
    let toWallet = await db_1.models.wallet.findOne({
        where: { userId, currency: toCurrency, type: toType },
    });
    if (!toWallet) {
        toWallet = await db_1.models.wallet.create({
            userId,
            currency: toCurrency,
            type: toType,
            status: true,
        });
    }
    return toWallet;
}
async function performTransaction(transferType, fromWallet, toWallet, parsedAmount, fromCurrency, toCurrency, userId, clientId, fromType, toType, currencyData) {
    const cacheManager = cache_1.CacheManager.getInstance();
    const settings = await cacheManager.getSettings();
    const walletTransferFeePercentage = settings.get("walletTransferFeePercentage") || 0;
    const transferFeeAmount = (0, utils_1.calculateTransferFee)(parsedAmount, walletTransferFeePercentage);
    const totalDeducted = parsedAmount;
    const targetReceiveAmount = parsedAmount - transferFeeAmount;
    if (fromWallet.balance < totalDeducted) {
        throw (0, error_1.createError)(400, "Insufficient balance to cover transfer and fees.");
    }
    return await db_1.sequelize.transaction(async (t) => {
        const requiresLedgerUpdate = (0, utils_1.requiresPrivateLedgerUpdate)(transferType, fromType, toType);
        // Normalize transferType
        const normalizedTransferType = (transferType || "").trim().toLowerCase();
        // Determine if we should force COMPLETED for certain conditions
        let forceCompleted = false;
        // If transfer is client-to-client, always completed
        if (normalizedTransferType === "client") {
            forceCompleted = true;
        }
        // If from ECO to FUTURES or FUTURES to ECO, also force completed
        if ((fromType === "ECO" && toType === "FUTURES") ||
            (fromType === "FUTURES" && toType === "ECO")) {
            forceCompleted = true;
        }
        const transferStatus = forceCompleted
            ? "COMPLETED"
            : requiresLedgerUpdate
                ? "PENDING"
                : "COMPLETED";
        if (transferStatus === "COMPLETED") {
            await handleCompleteTransfer({
                fromWallet,
                toWallet,
                parsedAmount,
                targetReceiveAmount,
                transferType: normalizedTransferType,
                fromType,
                fromCurrency,
                currencyData,
                t,
            });
        }
        else {
            await handlePendingTransfer({
                fromWallet,
                toWallet,
                totalDeducted,
                targetReceiveAmount,
                transferStatus,
                currencyData,
                t,
            });
        }
        const fromTransfer = await (0, utils_1.createTransferTransaction)(userId, fromWallet.id, "OUTGOING_TRANSFER", parsedAmount, transferFeeAmount, fromCurrency, toCurrency, fromWallet.id, toWallet.id, `Transfer to ${toType} wallet`, transferStatus, t);
        const toTransfer = await (0, utils_1.createTransferTransaction)(normalizedTransferType === "client" ? clientId : userId, toWallet.id, "INCOMING_TRANSFER", targetReceiveAmount, 0, fromCurrency, toCurrency, fromWallet.id, toWallet.id, `Transfer from ${fromType} wallet`, transferStatus, t);
        if (transferFeeAmount > 0) {
            await (0, utils_1.recordAdminProfit)({
                userId,
                transferFeeAmount,
                fromCurrency,
                fromType,
                toType,
                transactionId: fromTransfer.id,
                t,
            });
        }
        return { fromTransfer, toTransfer };
    });
}
async function handleCompleteTransfer({ fromWallet, toWallet, parsedAmount, targetReceiveAmount, transferType, fromType, fromCurrency, currencyData, t, }) {
    if (fromType === "ECO" && transferType === "client") {
        await handleEcoClientBalanceTransfer({
            fromWallet,
            toWallet,
            parsedAmount,
            fromCurrency,
            currencyData,
            t,
        });
    }
    else {
        await handleNonClientTransfer({
            fromWallet,
            toWallet,
            parsedAmount,
            fromCurrency,
            targetReceiveAmount,
            currencyData,
            t,
        });
    }
}
async function handleEcoClientBalanceTransfer({ fromWallet, toWallet, parsedAmount, fromCurrency, currencyData, t, }) {
    const fromAddresses = parseAddresses(fromWallet.address);
    const toAddresses = parseAddresses(toWallet.address);
    let remainingAmount = parsedAmount;
    for (const [chain, chainInfo] of (0, utils_1.getSortedChainBalances)(fromAddresses)) {
        if (remainingAmount <= 0)
            break;
        const transferableAmount = Math.min(chainInfo.balance, remainingAmount);
        chainInfo.balance -= transferableAmount;
        toAddresses[chain] = toAddresses[chain] || { balance: 0 };
        toAddresses[chain].balance += transferableAmount;
        await (0, utils_1.updatePrivateLedger)(fromWallet.id, 0, fromCurrency, chain, -transferableAmount, t);
        await (0, utils_1.updatePrivateLedger)(toWallet.id, 0, fromCurrency, chain, transferableAmount, t);
        remainingAmount -= transferableAmount;
    }
    if (remainingAmount > 0) {
        throw (0, error_1.createError)(400, "Insufficient chain balance across all addresses.");
    }
    await (0, utils_1.updateWalletBalances)(fromWallet, toWallet, parsedAmount, parsedAmount, currencyData.precision, t);
}
async function handleNonClientTransfer({ fromWallet, toWallet, parsedAmount, fromCurrency, targetReceiveAmount, currencyData, t, }) {
    // ECO -> ECO: Deduct and add between two ECO wallets
    if (fromWallet.type === "ECO" && toWallet.type === "ECO") {
        const deductionDetails = await deductFromEcoWallet(fromWallet, parsedAmount, fromCurrency, t);
        await addToEcoWallet(toWallet, deductionDetails, fromCurrency, t);
    }
    // ECO -> FUTURES: Deduct from ECO ledger only
    else if (fromWallet.type === "ECO" && toWallet.type === "FUTURES") {
        await deductFromEcoWallet(fromWallet, parsedAmount, fromCurrency, t);
        // No addition to FUTURES ledger since FUTURES doesn't have a chain ledger
    }
    // FUTURES -> ECO: Add the entire received amount to ECO ledger
    else if (fromWallet.type === "FUTURES" && toWallet.type === "ECO") {
        // Since we have no chain details from FUTURES, we fabricate a chain entry
        const additionDetails = [{ chain: "main", amount: targetReceiveAmount }];
        await addToEcoWallet(toWallet, additionDetails, fromCurrency, t);
    }
    // For all other types (FIAT <-> SPOT, etc.) no special ledger handling needed
    // They simply rely on standard logic, if any.
    // Update wallet balances after handling ledger updates if needed
    await (0, utils_1.updateWalletBalances)(fromWallet, toWallet, parsedAmount, targetReceiveAmount, currencyData.precision, t);
}
async function deductFromEcoWallet(wallet, amount, currency, t) {
    const addresses = parseAddresses(wallet.address);
    let remainingAmount = amount;
    const deductionDetails = [];
    for (const chain in addresses) {
        if (addresses.hasOwnProperty(chain) && addresses[chain].balance > 0) {
            const transferableAmount = Math.min(addresses[chain].balance, remainingAmount);
            addresses[chain].balance -= transferableAmount;
            deductionDetails.push({ chain, amount: transferableAmount });
            await (0, utils_1.updatePrivateLedger)(wallet.id, 0, currency, chain, -transferableAmount);
            remainingAmount -= transferableAmount;
            if (remainingAmount <= 0)
                break;
        }
    }
    if (remainingAmount > 0)
        throw (0, error_1.createError)(400, "Insufficient chain balance to complete the transfer");
    await wallet.update({
        address: JSON.stringify(addresses),
    }, { transaction: t });
    return deductionDetails;
}
async function addToEcoWallet(wallet, deductionDetails, currency, t) {
    const addresses = parseAddresses(wallet.address);
    for (const detail of deductionDetails) {
        const { chain, amount } = detail;
        if (!addresses[chain]) {
            addresses[chain] = {
                address: null,
                network: null,
                balance: 0,
            };
        }
        addresses[chain].balance += amount;
        await (0, utils_1.updatePrivateLedger)(wallet.id, 0, currency, chain, amount);
    }
    await wallet.update({
        address: JSON.stringify(addresses),
    }, { transaction: t });
}
async function handlePendingTransfer({ fromWallet, toWallet, totalDeducted, targetReceiveAmount, transferStatus, currencyData, t, }) {
    const newFromBalance = (0, utils_1.calculateNewBalance)(fromWallet.balance, -totalDeducted, currencyData);
    await fromWallet.update({ balance: newFromBalance }, { transaction: t });
    if (transferStatus === "COMPLETED") {
        const newToBalance = (0, utils_1.calculateNewBalance)(toWallet.balance, targetReceiveAmount, currencyData);
        await toWallet.update({ balance: newToBalance }, { transaction: t });
    }
}
function parseAddresses(address) {
    if (!address) {
        return {};
    }
    if (typeof address === "string") {
        try {
            return JSON.parse(address);
        }
        catch (error) {
            console.error("Failed to parse address JSON:", error);
            return {};
        }
    }
    if (typeof address === "object") {
        return address;
    }
    return {};
}
exports.parseAddresses = parseAddresses;
async function processInternalTransfer(fromUserId, toUserId, currency, chain, amount) {
    const fromWallet = await db_1.models.wallet.findOne({
        where: {
            userId: fromUserId,
            currency: currency,
            type: "ECO",
        },
    });
    if (!fromWallet) {
        throw (0, error_1.createError)({ statusCode: 404, message: "Sender wallet not found" });
    }
    let toWallet = await db_1.models.wallet.findOne({
        where: {
            userId: toUserId,
            currency: currency,
            type: "ECO",
        },
    });
    if (!toWallet) {
        toWallet = await db_1.models.wallet.create({
            userId: toUserId,
            currency: currency,
            type: "ECO",
            status: true,
        });
    }
    const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (fromWallet.balance < parsedAmount) {
        throw (0, error_1.createError)(400, "Insufficient balance.");
    }
    const cacheManager = cache_1.CacheManager.getInstance();
    const settings = await cacheManager.getSettings();
    const walletTransferFeePercentage = settings.get("walletTransferFeePercentage") || 0;
    const transferFeeAmount = (parsedAmount * walletTransferFeePercentage) / 100;
    const targetReceiveAmount = parsedAmount - transferFeeAmount;
    const transaction = await db_1.sequelize.transaction(async (t) => {
        let precision = 8;
        if (fromWallet.type === "ECO" && toWallet.type === "ECO") {
            const deductionDetails = await deductFromEcoWallet(fromWallet, parsedAmount, currency, t);
            await addToEcoWallet(toWallet, deductionDetails, currency, t);
            const currencyData = await (0, utils_1.getCurrencyData)(fromWallet.type, fromWallet.currency);
            precision = currencyData.precision;
        }
        await (0, utils_1.updateWalletBalances)(fromWallet, toWallet, parsedAmount, targetReceiveAmount, precision, t);
        const outgoingTransfer = await (0, utils_1.createTransferTransaction)(fromUserId, fromWallet.id, "OUTGOING_TRANSFER", parsedAmount, transferFeeAmount, currency, currency, fromWallet.id, toWallet.id, `Internal transfer to user ${toUserId}`, "COMPLETED", t);
        const incomingTransfer = await (0, utils_1.createTransferTransaction)(toUserId, toWallet.id, "INCOMING_TRANSFER", targetReceiveAmount, 0, currency, currency, fromWallet.id, toWallet.id, `Internal transfer from user ${fromUserId}`, "COMPLETED", t);
        if (transferFeeAmount > 0) {
            await (0, utils_1.recordAdminProfit)({
                userId: fromUserId,
                transferFeeAmount,
                fromCurrency: currency,
                fromType: "ECO",
                toType: "ECO",
                transactionId: outgoingTransfer.id,
                t,
            });
        }
        return { outgoingTransfer, incomingTransfer };
    });
    const userWallet = await db_1.models.wallet.findOne({
        where: { userId: fromUserId, currency, type: "ECO" },
    });
    return {
        transaction,
        balance: userWallet === null || userWallet === void 0 ? void 0 : userWallet.balance,
        method: chain,
        currency,
    };
}
exports.processInternalTransfer = processInternalTransfer;
