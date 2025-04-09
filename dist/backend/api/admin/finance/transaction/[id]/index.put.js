"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/transactions/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const db_1 = require("@b/db");
const utils_1 = require("@b/api/finance/transaction/utils");
const emails_1 = require("@b/utils/emails");
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const redis_1 = require("@b/utils/redis");
const queries_1 = require("@b/utils/eco/scylla/queries");
exports.metadata = {
    summary: "Updates an existing transaction",
    operationId: "updateTransaction",
    tags: ["Admin", "Wallets", "Transactions"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the transaction to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the transaction",
        content: {
            "application/json": {
                schema: utils_1.transactionUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Transaction"),
    requiresAuth: true,
    permission: "Access Transaction Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status, amount, fee, description, referenceId, metadata: requestMetadata, } = body;
    const transaction = await db_1.models.transaction.findOne({
        where: { id },
    });
    if (!transaction)
        throw new Error("Transaction not found");
    if (transaction.status !== "PENDING") {
        throw new Error("Only pending transactions can be updated");
    }
    transaction.amount = amount;
    transaction.fee = fee;
    transaction.description = description;
    transaction.referenceId = referenceId;
    return await db_1.sequelize.transaction(async (t) => {
        if (["FOREX_WITHDRAW", "FOREX_DEPOSIT"].includes(transaction.type)) {
            await handleForexTransaction(transaction, status, requestMetadata, t);
        }
        else if (["DEPOSIT", "WITHDRAW"].includes(transaction.type)) {
            await handleWalletTransaction(transaction, status, requestMetadata, t);
        }
        else if (transaction.type === "INCOMING_TRANSFER") {
            await handleIncomingTransfer(transaction, requestMetadata, t);
        }
        else if (transaction.type === "ICO_CONTRIBUTION") {
            await handleIcoContribution(transaction, status, requestMetadata, t);
        }
        transaction.status = status;
        await transaction.save({ transaction: t });
        return { message: "Transaction updated successfully" };
    });
};
function parseMetadata(metadataString) {
    let metadata = {};
    try {
        metadataString = metadataString.replace(/\\/g, "");
        metadata = JSON.parse(metadataString) || {};
    }
    catch (e) {
        console.error("Invalid JSON in metadata:", metadataString);
    }
    return metadata;
}
async function handleIncomingTransfer(transaction, rejection, t) {
    const metadata = parseMetadata(transaction.metadata);
    const wallet = await db_1.models.wallet.findOne({
        where: { id: transaction.walletId },
        transaction: t,
    });
    if (!wallet)
        throw new Error("Wallet not found");
    let price = 1; // Default price for USDT
    const fromCurrency = metadata.fromCurrency;
    if (!fromCurrency)
        throw new Error("From currency not found");
    // const toCurrency = metadata.toCurrency;
    const descriptionParts = transaction.description.split(" ");
    const fromType = descriptionParts[2]; // "SPOT", "ECO", "FIAT"
    if (fromType === "FIAT") {
        const currency = await db_1.models.currency.findOne({
            where: { id: fromCurrency },
            transaction: t,
        });
        if (!currency)
            throw new Error("Currency not found");
        if (currency.price === null || typeof currency.price === "undefined")
            throw new Error("Currency price not found");
        price = currency.price;
    }
    else if (fromType === "SPOT") {
        if (fromCurrency !== "USDT") {
            const redis = redis_1.RedisSingleton.getInstance();
            const cachedData = await redis.get("exchange:tickers");
            const tickers = cachedData ? JSON.parse(cachedData) : {};
            if (!tickers[fromCurrency]) {
                const exchange = await exchange_1.default.startExchange();
                const ticker = await exchange.fetchTicker(`${fromCurrency}/USDT`);
                if (!ticker || !ticker.last) {
                    throw new Error("Unable to fetch current market price");
                }
                price = ticker.last;
            }
            else {
                price = tickers[fromCurrency].last;
            }
        }
    }
    else if (fromType === "ECO") {
        const candles = await (0, queries_1.getLastCandles)();
        const candle = candles.find((c) => c.symbol === fromCurrency);
        if (!candle)
            throw new Error("Unable to fetch candle data for the currency");
        price = candle.close;
    }
    const amountToAdd = Number(transaction.amount) * price;
    let walletBalance = Number(wallet.balance);
    walletBalance += amountToAdd;
    await db_1.models.wallet.update({ balance: walletBalance }, { where: { id: wallet.id }, transaction: t });
    if (rejection) {
        metadata.message = rejection.message;
    }
    transaction.metadata = JSON.stringify(metadata);
}
async function handleForexTransaction(transaction, status, rejection, t) {
    const metadata = parseMetadata(transaction.metadata);
    const cost = Number(transaction.amount) * Number(metadata.price);
    if (transaction.status === "PENDING") {
        const account = await db_1.models.forexAccount.findOne({
            where: { userId: transaction.userId, type: "LIVE" },
            transaction: t,
        });
        if (!account)
            throw new Error("Account not found");
        const wallet = await db_1.models.wallet.findOne({
            where: { id: transaction.walletId },
            transaction: t,
        });
        if (!wallet)
            throw new Error("Wallet not found");
        if (status === "REJECTED") {
            await handleForexRejection(transaction, account, wallet, cost, t);
        }
        else if (status === "COMPLETED") {
            await handleForexCompletion(transaction, account, wallet, cost, t);
        }
        const user = await db_1.models.user.findOne({
            where: { id: transaction.userId },
        });
        if (user) {
            await (0, emails_1.sendForexTransactionEmail)(user, transaction, account, wallet.currency, transaction.type);
        }
    }
    if (rejection) {
        metadata.message = rejection.message;
    }
    transaction.metadata = JSON.stringify(metadata);
}
async function handleWalletTransaction(transaction, status, rejection, t) {
    const metadata = parseMetadata(transaction.metadata);
    const wallet = await db_1.models.wallet.findOne({
        where: { id: transaction.walletId },
        transaction: t,
    });
    if (!wallet)
        throw new Error("Wallet not found");
    if (transaction.status === "PENDING") {
        if (status === "REJECTED") {
            await handleWalletRejection(transaction, wallet, t);
        }
        else if (status === "COMPLETED") {
            await handleWalletCompletion(transaction, wallet, t);
        }
        const user = await db_1.models.user.findOne({
            where: { id: transaction.userId },
        });
        if (user) {
            await (0, emails_1.sendTransactionStatusUpdateEmail)(user, transaction, wallet, wallet.balance, metadata.message || null);
        }
    }
    if (rejection) {
        metadata.message = rejection.message;
    }
    transaction.metadata = JSON.stringify(metadata);
}
async function handleForexCompletion(transaction, account, wallet, cost, t) {
    if (transaction.type === "FOREX_DEPOSIT") {
        // Increase forex account balance
        await updateForexAccountBalance(account, cost, true, t);
        // Wallet balance was already decreased during the deposit request
    }
    else if (transaction.type === "FOREX_WITHDRAW") {
        // Increase wallet balance
        await updateWalletBalance(wallet, cost, true, t);
        // Forex account balance was already decreased during the withdrawal request
    }
}
async function handleForexRejection(transaction, account, wallet, cost, t) {
    if (transaction.type === "FOREX_DEPOSIT") {
        // Refund amount to wallet
        await updateWalletBalance(wallet, cost, true, t);
        // Forex account balance was not changed
    }
    else if (transaction.type === "FOREX_WITHDRAW") {
        // Refund amount to forex account
        await updateForexAccountBalance(account, cost, true, t);
        // Wallet balance was not changed
    }
}
async function handleWalletRejection(transaction, wallet, t) {
    let balance = Number(wallet.balance);
    if (transaction.type === "WITHDRAW") {
        balance += Number(transaction.amount);
    }
    if (wallet.balance !== balance) {
        await db_1.models.wallet.update({ balance }, { where: { id: wallet.id }, transaction: t });
    }
}
async function handleWalletCompletion(transaction, wallet, t) {
    let balance = Number(wallet.balance);
    if (transaction.type === "DEPOSIT") {
        balance += Number(transaction.amount) - Number(transaction.fee);
    }
    await db_1.models.wallet.update({ balance }, { where: { id: wallet.id }, transaction: t });
}
async function updateForexAccountBalance(account, cost, refund, t) {
    let balance = Number(account.balance);
    balance = refund ? balance + cost : balance - cost;
    if (balance < 0)
        throw new Error("Insufficient forex account balance");
    await db_1.models.forexAccount.update({ balance }, { where: { id: account.id }, transaction: t });
    return db_1.models.forexAccount.findOne({
        where: { id: account.id },
        transaction: t,
    });
}
async function updateWalletBalance(wallet, cost, refund, t) {
    let walletBalance = Number(wallet.balance);
    walletBalance = refund ? walletBalance + cost : walletBalance - cost;
    if (walletBalance < 0)
        throw new Error("Insufficient wallet balance");
    await db_1.models.wallet.update({ balance: walletBalance }, { where: { id: wallet.id }, transaction: t });
    return wallet;
}
async function handleIcoContribution(transaction, status, rejection, t) {
    const metadata = parseMetadata(transaction.metadata);
    const contribution = await db_1.models.icoContribution.findOne({
        where: { id: transaction.referenceId },
        transaction: t,
    });
    if (!contribution)
        throw new Error("ICO Contribution not found");
    if (transaction.status === "PENDING") {
        if (status === "REJECTED") {
            await handleIcoContributionRejection(contribution, transaction, t);
        }
        else if (status === "COMPLETED") {
            await handleIcoContributionCompletion(contribution, transaction, t);
        }
        const user = await db_1.models.user.findOne({
            where: { id: transaction.userId },
        });
        const phase = (await db_1.models.icoPhase.findByPk(contribution.phaseId, {
            include: [{ model: db_1.models.icoToken, as: "token" }],
            transaction: t,
        }));
        if (user && phase) {
            await (0, emails_1.sendIcoContributionEmail)(user, contribution, phase.token, phase, "IcoContributionPaid", transaction.id);
        }
    }
    if (rejection) {
        metadata.message = rejection.message;
    }
    transaction.metadata = JSON.stringify(metadata);
}
async function handleIcoContributionRejection(contribution, transaction, t) {
    // Logic to handle ICO contribution rejection, such as refunding the amount
    const wallet = await db_1.models.wallet.findOne({
        where: { id: transaction.walletId },
        transaction: t,
    });
    if (!wallet)
        throw new Error("Wallet not found");
    wallet.balance += Number(transaction.amount);
    await wallet.save({ transaction: t });
    contribution.status = "REJECTED";
    await contribution.save({ transaction: t });
}
async function handleIcoContributionCompletion(contribution, transaction, t) {
    // Logic to handle ICO contribution completion, such as updating the token allocation
    contribution.status = "COMPLETED";
    await contribution.save({ transaction: t });
    // Additional logic for processing token allocation, etc.
}
