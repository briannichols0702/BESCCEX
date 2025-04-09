"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionUpdateSchema = exports.transactionSchema = exports.baseTransactionSchema = void 0;
const schema_1 = require("@b/utils/schema");
// Reusable schema components for transactions
const id = {
    ...(0, schema_1.baseStringSchema)("ID of the transaction"),
    nullable: true,
};
const type = (0, schema_1.baseStringSchema)("Type of the transaction (DEPOSIT, WITHDRAW, etc.)");
const status = {
    ...(0, schema_1.baseStringSchema)("Current status of the transaction (PENDING, COMPLETED, etc.)"),
    enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED", "REJECTED", "EXPIRED"],
};
const amount = (0, schema_1.baseNumberSchema)("Amount involved in the transaction");
const fee = (0, schema_1.baseNumberSchema)("Fee associated with the transaction");
const description = (0, schema_1.baseStringSchema)("Description of the transaction");
const metadata = {
    type: "object",
    description: "Additional metadata of the transaction",
    nullable: true,
};
const referenceId = {
    ...(0, schema_1.baseStringSchema)("Reference ID of the transaction"),
    nullable: true,
};
// Base schema definition for transactions
exports.baseTransactionSchema = {
    id,
    type,
    status,
    amount,
    fee,
    description,
    metadata,
    referenceId,
};
// Full schema for a transaction including user and wallet details
exports.transactionSchema = {
    ...exports.baseTransactionSchema,
    id: {
        ...id,
        nullable: false, // ID should always be present for a created transaction
    },
    user: {
        type: "object",
        properties: {
            id: { type: "string", description: "User ID" },
            firstName: {
                ...(0, schema_1.baseStringSchema)("User's first name"),
                nullable: true,
            },
            lastName: {
                ...(0, schema_1.baseStringSchema)("User's last name"),
                nullable: true,
            },
            avatar: {
                ...(0, schema_1.baseStringSchema)("User's avatar"),
                nullable: true,
            },
        },
        nullable: true,
    },
    wallet: {
        type: "object",
        properties: {
            currency: { type: "string", description: "Currency of the wallet" },
            type: { type: "string", description: "Type of the wallet" },
        },
        nullable: true,
    },
};
// Schema for updating a transaction
exports.transactionUpdateSchema = {
    type: "object",
    properties: {
        status,
        amount,
        fee,
        description,
        referenceId,
        metadata,
    },
    required: ["status", "amount"],
};
