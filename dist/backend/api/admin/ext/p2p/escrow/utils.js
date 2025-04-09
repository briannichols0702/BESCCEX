"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pEscrowStoreSchema = exports.p2pEscrowUpdateSchema = exports.baseP2pEscrowSchema = exports.p2pEscrowSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the P2P Escrow");
const tradeId = (0, schema_1.baseStringSchema)("Associated Trade ID");
const amount = (0, schema_1.baseNumberSchema)("Amount held in escrow");
const status = (0, schema_1.baseEnumSchema)("Current status of the escrow", [
    "PENDING",
    "HELD",
    "RELEASED",
    "CANCELLED",
]);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the P2P Escrow");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the P2P Escrow", true);
exports.p2pEscrowSchema = {
    id,
    tradeId,
    amount,
    status,
    createdAt,
    updatedAt,
};
exports.baseP2pEscrowSchema = {
    id,
    tradeId,
    amount,
    status,
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the P2P Escrow, if any"),
};
exports.p2pEscrowUpdateSchema = {
    type: "object",
    properties: {
        status,
        amount,
    },
    required: ["status", "amount"],
};
exports.p2pEscrowStoreSchema = {
    description: `P2P Escrow created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseP2pEscrowSchema,
            },
        },
    },
};
