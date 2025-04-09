"use strict";
// /api/p2p/disputes/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new P2P Dispute",
    operationId: "storeP2PDispute",
    tags: ["Admin", "P2P", "Disputes"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.p2pDisputeUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.p2pDisputeStoreSchema, "P2P Dispute"),
    requiresAuth: true,
    permission: "Access P2P Dispute Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { tradeId, raisedById, reason, status, resolution } = body;
    return await (0, query_1.storeRecord)({
        model: "p2pDispute",
        data: {
            tradeId,
            raisedById,
            reason,
            status,
            resolution,
        },
    });
};
