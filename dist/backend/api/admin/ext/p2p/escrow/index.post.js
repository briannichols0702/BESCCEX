"use strict";
// /api/p2p/escrows/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new P2P Escrow record",
    operationId: "storeP2PEscrow",
    tags: ["Admin", "P2P", "Escrows"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.p2pEscrowUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.p2pEscrowStoreSchema, "P2P Escrow"),
    requiresAuth: true,
    permission: "Access P2P Escrow Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { tradeId, amount, status } = body;
    return await (0, query_1.storeRecord)({
        model: "p2pEscrow",
        data: {
            tradeId,
            amount,
            status,
        },
    });
};
