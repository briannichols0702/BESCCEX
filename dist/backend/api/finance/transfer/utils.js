"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransferEmails = exports.createTransferTransaction = exports.recordAdminProfit = exports.getSortedChainBalances = exports.calculateNewBalance = exports.updateWalletBalances = exports.requiresPrivateLedgerUpdate = exports.calculateTransferFee = exports.getCurrencyData = exports.updatePrivateLedger = void 0;
const db_1 = require("@b/db");
const emails_1 = require("@b/utils/emails");
const error_1 = require("@b/utils/error");
async function updatePrivateLedger(walletId, index, currency, chain, amount, transaction // Optional transaction parameter
) {
    const networkEnvVar = `${chain.toUpperCase()}_NETWORK`;
    const network = process.env[networkEnvVar];
    if (!network) {
        throw (0, error_1.createError)(400, `Network environment variable for ${chain} is not set`);
    }
    const existingLedger = await db_1.models.ecosystemPrivateLedger.findOne({
        where: {
            walletId,
            index,
            currency,
            chain,
            network,
        },
        ...(transaction && { transaction }), // Include transaction if provided
    });
    if (existingLedger) {
        await db_1.models.ecosystemPrivateLedger.update({
            offchainDifference: existingLedger.offchainDifference + amount,
        }, {
            where: {
                walletId,
                index,
                currency,
                chain,
                network,
            },
            ...(transaction && { transaction }), // Include transaction if provided
        });
    }
    else {
        await db_1.models.ecosystemPrivateLedger.create({
            walletId,
            index,
            currency,
            chain,
            offchainDifference: amount,
            network,
        }, transaction ? { transaction } : undefined); // Include transaction if provided
    }
}
exports.updatePrivateLedger = updatePrivateLedger;
async function getCurrencyData(fromType, currency) {
    switch (fromType) {
        case "FIAT":
            return await db_1.models.currency.findOne({ where: { id: currency } });
        case "SPOT":
            return await db_1.models.exchangeCurrency.findOne({ where: { currency } });
        case "ECO":
        case "FUTURES":
            return await db_1.models.ecosystemToken.findOne({ where: { currency } });
    }
}
exports.getCurrencyData = getCurrencyData;
function calculateTransferFee(amount, feePercentage) {
    return (amount * feePercentage) / 100;
}
exports.calculateTransferFee = calculateTransferFee;
function requiresPrivateLedgerUpdate(transferType, fromType, toType) {
    return ((transferType === "client" && (fromType === "ECO" || toType === "ECO")) ||
        (fromType === "ECO" && toType === "FUTURES") ||
        (fromType === "FUTURES" && toType === "ECO"));
}
exports.requiresPrivateLedgerUpdate = requiresPrivateLedgerUpdate;
async function updateWalletBalances(fromWallet, toWallet, parsedAmount, targetReceiveAmount, precision, t) {
    const updatedFromBalance = calculateNewBalance(fromWallet.balance, -parsedAmount, precision);
    const updatedToBalance = calculateNewBalance(toWallet.balance, targetReceiveAmount, precision);
    await fromWallet.update({ balance: updatedFromBalance }, { transaction: t });
    await toWallet.update({ balance: updatedToBalance }, { transaction: t });
}
exports.updateWalletBalances = updateWalletBalances;
function calculateNewBalance(current, change, precision) {
    return parseFloat((current + change).toFixed(precision || 8));
}
exports.calculateNewBalance = calculateNewBalance;
function getSortedChainBalances(fromAddresses) {
    return Object.entries(fromAddresses)
        .filter(([_, chainInfo]) => chainInfo.balance > 0)
        .sort(([, a], [, b]) => b.balance - a.balance);
}
exports.getSortedChainBalances = getSortedChainBalances;
async function recordAdminProfit({ userId, transferFeeAmount, fromCurrency, fromType, toType, transactionId, t, }) {
    await db_1.models.adminProfit.create({
        amount: transferFeeAmount,
        currency: fromCurrency,
        type: "TRANSFER",
        transactionId,
        description: `Transfer fee for user (${userId}) of ${transferFeeAmount} ${fromCurrency} from ${fromType} to ${toType}`,
    }, { transaction: t });
}
exports.recordAdminProfit = recordAdminProfit;
async function createTransferTransaction(userId, walletId, type, amount, fee, // Include the fee parameter for better clarity
fromCurrency, toCurrency, fromWalletId, toWalletId, description, status, transaction) {
    return await db_1.models.transaction.create({
        userId,
        walletId,
        type,
        amount,
        fee, // Record the fee in the transaction
        status,
        metadata: JSON.stringify({
            fromWallet: fromWalletId,
            toWallet: toWalletId,
            fromCurrency,
            toCurrency,
        }),
        description,
    }, { transaction });
}
exports.createTransferTransaction = createTransferTransaction;
async function sendTransferEmails(user, toUser, fromWallet, toWallet, amount, transaction) {
    await (0, emails_1.sendOutgoingTransferEmail)(user, toUser, fromWallet, amount, transaction.fromTransfer.id);
    await (0, emails_1.sendIncomingTransferEmail)(toUser, user, toWallet, amount, transaction.toTransfer.id);
}
exports.sendTransferEmails = sendTransferEmails;
