"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpotWalletBalance = exports.deleteTransaction = exports.getTransactionQuery = exports.verifyTransaction = exports.stopVerificationSchedule = exports.startSpotVerificationSchedule = exports.spotVerificationIntervals = exports.metadata = void 0;
const sequelize_1 = require("sequelize");
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const Websocket_1 = require("@b/handler/Websocket");
const error_1 = require("@b/utils/error");
const affiliate_1 = require("@b/utils/affiliate");
const index_get_1 = require("@b/api/user/profile/index.get");
const emails_1 = require("@b/utils/emails");
const db_1 = require("@b/db");
const utils_1 = require("../../utils");
const notifications_1 = require("@b/utils/notifications");
const cache_1 = require("@b/utils/cache");
const utils_2 = require("./utils");
const path = "/api/finance/deposit/spot";
exports.metadata = {};
exports.spotVerificationIntervals = new Map();
exports.default = async (data, message) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    if (typeof message === "string") {
        message = JSON.parse(message);
    }
    const { trx } = message.payload;
    const transaction = await db_1.models.transaction.findOne({
        where: { referenceId: trx, userId: user.id, type: "DEPOSIT" },
    });
    if (transaction) {
        sendMessage(message.payload, {
            status: 200,
            message: "Transaction hash already exists",
        });
        return;
    }
    startSpotVerificationSchedule(transaction.id, user.id, trx);
};
const sendMessage = (payload, data) => {
    try {
        (0, Websocket_1.sendMessageToRoute)(path, payload, {
            stream: "verification",
            data: data,
        });
    }
    catch (error) {
        console.error(`Failed to send message: ${error}`);
    }
};
function startSpotVerificationSchedule(transactionId, userId, trx) {
    const payload = {
        trx,
    };
    // Clear any existing interval for this transaction (if any)
    const existingInterval = exports.spotVerificationIntervals.get(transactionId);
    if (existingInterval) {
        clearInterval(existingInterval);
    }
    // Schedule the verifyTransaction function to run every 30 seconds
    const interval = setInterval(async () => {
        try {
            await verifyTransaction(userId, trx, payload);
        }
        catch (error) {
            console.error(`Error verifying transaction: ${error.message}`);
            stopVerificationSchedule(transactionId);
        }
    }, 15000);
    // Store the interval in the map
    exports.spotVerificationIntervals.set(transactionId, interval);
    // Stop the verification schedule after 30 minutes
    setTimeout(() => {
        stopVerificationSchedule(transactionId);
    }, 1800000); // 30 minutes in milliseconds
}
exports.startSpotVerificationSchedule = startSpotVerificationSchedule;
function stopVerificationSchedule(transactionId) {
    const interval = exports.spotVerificationIntervals.get(transactionId);
    if (interval) {
        clearInterval(interval);
        exports.spotVerificationIntervals.delete(transactionId);
    }
}
exports.stopVerificationSchedule = stopVerificationSchedule;
async function verifyTransaction(userId, trx, payload) {
    var _a;
    const transaction = await getTransactionQuery(userId, trx);
    if (!transaction) {
        throw new Error("Transaction not found");
    }
    const wallet = await db_1.models.wallet.findByPk(transaction.walletId);
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    const { metadata, xtChain } = (0, utils_2.parseMetadataAndMapChainToXt)(transaction.metadata);
    if (transaction.status === "COMPLETED") {
        sendMessage(payload, {
            status: 201,
            message: "Transaction already completed",
            transaction,
            balance: wallet.balance,
            currency: wallet.currency,
            chain: metadata.chain,
            method: "Wallet Transfer",
        });
        stopVerificationSchedule(transaction.id);
        return;
    }
    // Initialize exchange
    const exchange = await exchange_1.default.startExchange();
    if (!exchange) {
        throw new Error("Exchange not found");
    }
    const provider = await exchange_1.default.getProvider();
    if (!provider) {
        throw new Error("Provider not found");
    }
    try {
        await exchange_1.default.testExchangeCredentials(provider);
    }
    catch (error) {
        console.error(`Error testing exchange credentials: ${error.message}`);
        return;
    }
    let deposits = [];
    try {
        if (exchange.has["fetchDeposits"]) {
            const params = {};
            // If the exchange is xt, pass the chain as `network`
            if (xtChain) {
                params.chain = xtChain;
            }
            deposits = await exchange.fetchDeposits(wallet.currency, undefined, undefined, params);
            console.log("🚀 ~ deposits:", deposits);
        }
        else if (exchange.has["fetchTransactions"]) {
            deposits = await exchange.fetchTransactions();
        }
    }
    catch (error) {
        console.error("Error fetching deposits or transactions:", error);
        return; // Exit the function if we can't fetch deposits
    }
    let deposit;
    if (provider === "binance") {
        deposit = deposits.find((d) => {
            // Parse txid if it's from Binance and contains "Off-chain transfer"
            const parsedTxid = parseBinanceTxid(d.txid);
            return parsedTxid === transaction.referenceId;
        });
    }
    else {
        // For other providers, use the txid as is
        deposit = deposits.find((d) => d.txid === transaction.referenceId);
    }
    if (!deposit) {
        return;
    }
    if (deposit.status !== "ok") {
        return;
    }
    const amount = deposit.amount;
    const fee = ((_a = deposit.fee) === null || _a === void 0 ? void 0 : _a.cost) || 0;
    if (["kucoin", "binance", "okx", "xt"].includes(provider) &&
        wallet.currency !== deposit.currency) {
        sendMessage(payload, {
            status: 400,
            message: "Invalid deposit currency",
        });
        stopVerificationSchedule(transaction.id);
        await deleteTransaction(transaction.id);
        return;
    }
    if (transaction.status === "COMPLETED") {
        sendMessage(payload, {
            status: 201,
            message: "Transaction already completed",
            transaction,
            balance: wallet.balance,
            currency: wallet.currency,
            chain: metadata.chain,
            method: "Wallet Transfer",
        });
        stopVerificationSchedule(transaction.id);
        return;
    }
    const cacheManager = cache_1.CacheManager.getInstance();
    const settings = await cacheManager.getSettings();
    if (settings.has("depositExpiration") &&
        settings.get("depositExpiration") === "true") {
        const createdAt = deposit.timestamp / 1000;
        const transactionCreatedAt = new Date(transaction.createdAt).getTime() / 1000;
        const currentTime = Date.now() / 1000;
        const timeDiff = (currentTime - createdAt) / 60; // Difference in minutes
        if (createdAt < transactionCreatedAt - 900 ||
            createdAt > transactionCreatedAt + 900 ||
            timeDiff > 45) {
            sendMessage(payload, {
                status: 400,
                message: "Deposit expired",
            });
            stopVerificationSchedule(transaction.id);
            await (0, utils_1.updateTransaction)(transaction.id, {
                status: "TIMEOUT",
                description: "Deposit expired. Please try again.",
                amount: amount,
            });
            return;
        }
    }
    // Generalized function to parse txid if it includes text like "Off-chain transfer" in different languages
    function parseBinanceTxid(txid) {
        // A regex that matches any variations of "Off-chain transfer" in all locales
        const offChainTransferPatterns = [
            /off-?chain transfer\s+(\w+)/i, // English: Off-chain transfer or Offchain transfer
            /transferência\s+off-chain\s+(\w+)/i, // Portuguese: Transferência off-chain
            /transferencia\s+off-chain\s+(\w+)/i, // Spanish: Transferencia off-chain
        ];
        // Try to match the txid against the patterns
        for (const pattern of offChainTransferPatterns) {
            const match = txid.match(pattern);
            if (match && match[1]) {
                return match[1]; // Return the extracted transaction ID part
            }
        }
        // If no pattern matches, return the original txid
        return txid;
    }
    // update the amount and fee of the transaction using the deposit data
    const updatedTransaction = await (0, utils_1.updateTransaction)(transaction.id, {
        status: "COMPLETED",
        description: `Deposit of ${amount} ${wallet.currency} to wallet`,
        amount: amount,
        fee: fee,
    });
    // Update the wallet balance
    const updatedWallet = (await updateSpotWalletBalance(userId, wallet.currency, amount, fee, "DEPOSIT"));
    if (!updatedWallet) {
        sendMessage(payload, {
            status: 500,
            message: "Failed to update wallet balance",
        });
        stopVerificationSchedule(updatedTransaction.id);
        return;
    }
    // Transfer the amount from main to trade account within KuCoin
    if (provider === "kucoin") {
        try {
            // Transferring the amount from main to trade account within KuCoin
            await exchange.transfer(wallet.currency, deposit.amount, "main", "trade");
        }
        catch (error) {
            console.error(`Transfer failed: ${error.message}`);
        }
    }
    const userData = await (0, index_get_1.getUserById)(userId);
    try {
        await (0, emails_1.sendSpotWalletDepositConfirmationEmail)(userData, updatedTransaction, updatedWallet, metadata.chain);
        await (0, notifications_1.handleNotification)({
            userId: userId,
            type: "ACTIVITY",
            title: "Deposit Confirmation",
            message: `Your deposit of ${amount} ${wallet.currency} has been confirmed.`,
        });
    }
    catch (error) {
        console.error(`Deposit confirmation email failed: ${error.message}`);
    }
    try {
        await (0, affiliate_1.processRewards)(userData.id, amount, "WELCOME_BONUS", wallet.currency);
    }
    catch (error) {
        console.error(`Error processing rewards: ${error.message}`);
    }
    sendMessage(payload, {
        status: 200,
        message: "Transaction completed",
        transaction: updatedTransaction,
        balance: updatedWallet.balance,
        currency: updatedWallet.currency,
        chain: metadata.chain,
        method: "Wallet Transfer",
    });
    stopVerificationSchedule(updatedTransaction.id);
}
exports.verifyTransaction = verifyTransaction;
function normalizeTransactionReference(reference) {
    const lowerCaseReference = reference.toLowerCase().trim();
    // Array of possible patterns (we can expand this list for more languages)
    const offChainPatterns = [
        "off-chain transfer",
        "offchain transfer", // sometimes it may be written without hyphen
        "transferencia fuera de cadena", // Spanish
        // Add more language variations here if needed
    ];
    // Check if the reference matches any known off-chain transfer pattern
    for (const pattern of offChainPatterns) {
        if (lowerCaseReference.includes(pattern)) {
            return "off-chain transfer"; // Standardize to a unified identifier
        }
    }
    return reference; // Return the original reference if no pattern matches
}
async function getTransactionQuery(userId, trx) {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const transaction = await db_1.models.transaction.findOne({
        where: {
            referenceId: trx,
            userId: userId,
            type: "DEPOSIT",
            createdAt: {
                [sequelize_1.Op.gte]: thirtyMinutesAgo,
            },
        },
        include: [
            {
                model: db_1.models.wallet,
                as: "wallet",
                attributes: ["id", "currency"],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
    if (!transaction) {
        throw new Error("Transaction not found");
    }
    return transaction.get({ plain: true });
}
exports.getTransactionQuery = getTransactionQuery;
async function deleteTransaction(id) {
    await db_1.models.transaction.destroy({
        where: {
            id,
        },
    });
}
exports.deleteTransaction = deleteTransaction;
async function updateSpotWalletBalance(userId, currency, amount, fee, type) {
    const wallet = await db_1.models.wallet.findOne({
        where: {
            userId: userId,
            currency: currency,
            type: "SPOT",
        },
    });
    if (!wallet) {
        return new Error("Wallet not found");
    }
    let balance;
    switch (type) {
        case "WITHDRAWAL":
            balance = wallet.balance - (amount + fee);
            break;
        case "DEPOSIT":
            balance = wallet.balance + (amount - fee);
            break;
        case "REFUND_WITHDRAWAL":
            balance = wallet.balance + amount + fee;
            break;
        default:
            break;
    }
    if (balance < 0) {
        throw new Error("Insufficient balance");
    }
    await db_1.models.wallet.update({
        balance: balance,
    }, {
        where: {
            id: wallet.id,
        },
    });
    const updatedWallet = await db_1.models.wallet.findByPk(wallet.id);
    if (!updatedWallet) {
        throw new Error("Wallet not found");
    }
    return updatedWallet.get({ plain: true });
}
exports.updateSpotWalletBalance = updateSpotWalletBalance;
