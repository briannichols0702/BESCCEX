"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletUpdateSchema = exports.walletSchema = exports.updateUserWalletBalance = exports.getUserID = void 0;
const db_1 = require("@b/db");
const schema_1 = require("@b/utils/schema");
async function getUserID(id) {
    const user = await db_1.models.user.findOne({
        where: { id },
    });
    if (!user)
        throw new Error("Invalid user UUID");
    return user.id;
}
exports.getUserID = getUserID;
async function updateUserWalletBalance(id, amount, fee, type) {
    const wallet = await db_1.models.wallet.findOne({
        where: {
            id,
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
    const response = await db_1.models.wallet.findOne({
        where: {
            id: wallet.id,
        },
    });
    if (!response) {
        throw new Error("Wallet not found");
    }
    return response;
}
exports.updateUserWalletBalance = updateUserWalletBalance;
// Reusable schema components for wallets
const id = (0, schema_1.baseStringSchema)("ID of the wallet");
const type = (0, schema_1.baseStringSchema)("Type of the wallet");
const currency = (0, schema_1.baseStringSchema)("Currency of the wallet");
const balance = (0, schema_1.baseNumberSchema)("Current balance of the wallet");
const inOrder = (0, schema_1.baseNumberSchema)("Amount currently held in orders");
const address = {
    type: "object",
    additionalProperties: true, // Assuming dynamic keys for address
    description: "Crypto address associated with the wallet",
};
const status = (0, schema_1.baseBooleanSchema)("Status of the wallet (active or inactive)");
// Base schema definition for wallet properties
const baseWalletProperties = {
    id,
    type,
    currency,
    balance,
    inOrder,
    status,
};
// Full schema for a wallet including user and transaction details
exports.walletSchema = {
    ...baseWalletProperties,
    user: {
        type: "object",
        properties: {
            id: { type: "string", description: "User ID" },
            firstName: { type: "string", description: "First name of the user" },
            lastName: { type: "string", description: "Last name of the user" },
            avatar: { type: "string", description: "Avatar URL of the user" },
        },
    },
    transactions: {
        type: "array",
        description: "List of transactions associated with the wallet",
        items: {
            type: "object",
            properties: {
                id: { type: "string", description: "Transaction ID" },
                amount: { type: "number", description: "Amount of the transaction" },
                fee: { type: "number", description: "Transaction fee" },
                type: { type: "string", description: "Type of the transaction" },
                status: { type: "string", description: "Status of the transaction" },
                createdAt: {
                    type: "string",
                    format: "date-time",
                    description: "Creation date of the transaction",
                },
                metadata: {
                    type: "object",
                    description: "Metadata of the transaction",
                },
            },
        },
    },
};
// Schema for updating a wallet
exports.walletUpdateSchema = {
    type: "object",
    properties: {
        type,
        currency,
        balance,
        inOrder,
        status,
    },
    required: ["type", "currency", "balance", "status"],
};
