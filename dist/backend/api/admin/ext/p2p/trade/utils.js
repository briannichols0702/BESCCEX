"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pTradeStoreSchema = exports.p2pTradeUpdateSchema = exports.baseP2pTradeSchema = exports.p2pTradeSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the P2P Trade");
const userId = (0, schema_1.baseStringSchema)("ID of the Buyer User");
const sellerId = (0, schema_1.baseStringSchema)("ID of the Seller User");
const offerId = (0, schema_1.baseStringSchema)("ID of the P2P Offer associated with the trade");
const amount = (0, schema_1.baseNumberSchema)("Amount involved in the trade");
const status = (0, schema_1.baseEnumSchema)("Current status of the trade", [
    "PENDING",
    "PAID",
    "DISPUTE_OPEN",
    "ESCROW_REVIEW",
    "CANCELLED",
    "COMPLETED",
    "REFUNDED",
]);
const messages = (0, schema_1.baseStringSchema)("Messages related to the trade", 255, 0, true);
const txHash = (0, schema_1.baseStringSchema)("Transaction hash if applicable", 255, 0, true);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the trade");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the trade");
exports.p2pTradeSchema = {
    id,
    userId,
    sellerId,
    offerId,
    amount,
    status,
    messages,
    txHash,
    createdAt,
    updatedAt,
};
exports.baseP2pTradeSchema = {
    id,
    userId,
    sellerId,
    offerId,
    amount,
    status,
    messages,
    txHash,
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the trade, if any"),
};
exports.p2pTradeUpdateSchema = {
    type: "object",
    properties: {
        status,
        messages,
        txHash,
    },
    required: ["status"], // Adjust according to business logic if necessary
};
exports.p2pTradeStoreSchema = {
    description: `P2P Trade created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseP2pTradeSchema,
            },
        },
    },
};
