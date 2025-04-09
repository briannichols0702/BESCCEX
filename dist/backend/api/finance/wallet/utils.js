"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.getWalletById = exports.getWallet = exports.baseTransactionSchema = exports.baseWalletSchema = void 0;
const db_1 = require("@b/db");
const schema_1 = require("@b/utils/schema");
exports.baseWalletSchema = {
    id: (0, schema_1.baseStringSchema)("ID of the wallet"),
    userId: (0, schema_1.baseStringSchema)("ID of the user who owns the wallet"),
    type: (0, schema_1.baseStringSchema)("Type of the wallet"),
    currency: (0, schema_1.baseStringSchema)("Currency of the wallet"),
    balance: (0, schema_1.baseNumberSchema)("Current balance of the wallet"),
    inOrder: (0, schema_1.baseNumberSchema)("Amount currently in order"),
    address: (0, schema_1.baseStringSchema)("Address associated with the wallet"),
    status: (0, schema_1.baseBooleanSchema)("Status of the wallet"),
    createdAt: (0, schema_1.baseDateTimeSchema)("Date and time when the wallet was created"),
    updatedAt: (0, schema_1.baseDateTimeSchema)("Date and time when the wallet was last updated"),
};
exports.baseTransactionSchema = {
    id: (0, schema_1.baseStringSchema)("ID of the transaction"),
    userId: (0, schema_1.baseStringSchema)("ID of the user who created the transaction"),
    walletId: (0, schema_1.baseStringSchema)("ID of the wallet associated with the transaction"),
    type: (0, schema_1.baseStringSchema)("Type of the transaction"),
    status: (0, schema_1.baseStringSchema)("Status of the transaction"),
    amount: (0, schema_1.baseNumberSchema)("Amount of the transaction"),
    fee: (0, schema_1.baseNumberSchema)("Fee charged for the transaction"),
    description: (0, schema_1.baseStringSchema)("Description of the transaction"),
    metadata: (0, schema_1.baseObjectSchema)("Metadata of the transaction"),
    referenceId: (0, schema_1.baseStringSchema)("Reference ID of the transaction"),
    createdAt: (0, schema_1.baseDateTimeSchema)("Date and time when the transaction was created"),
    updatedAt: (0, schema_1.baseDateTimeSchema)("Date and time when the transaction was last updated"),
};
async function getWallet(userId, type, currency, hasTransactions = false) {
    const include = hasTransactions
        ? [
            {
                model: db_1.models.transaction,
                as: "transactions",
            },
        ]
        : [];
    const response = await db_1.models.wallet.findOne({
        where: {
            userId,
            currency,
            type,
        },
        include,
        order: hasTransactions ? [["transactions.createdAt", "DESC"]] : [],
    });
    if (!response) {
        throw new Error("Wallet not found");
    }
    return response.get({ plain: true });
}
exports.getWallet = getWallet;
async function getWalletById(id) {
    const response = await db_1.models.wallet.findOne({
        where: { id },
    });
    if (!response) {
        throw new Error("Wallet not found");
    }
    return response.get({ plain: true });
}
exports.getWalletById = getWalletById;
async function getTransactions(id) {
    const wallet = await db_1.models.wallet.findOne({
        where: { id },
    });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    return (await db_1.models.transaction.findAll({
        where: { walletId: wallet.id },
    })).map((transaction) => transaction.get({ plain: true }));
}
exports.getTransactions = getTransactions;
