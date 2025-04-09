"use strict";
// /api/p2p/commissions/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new P2P Commission",
    operationId: "storeP2PCommission",
    tags: ["Admin", "P2P", "Commissions"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.p2pCommissionUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.p2pCommissionStoreSchema, "P2P Commission"),
    requiresAuth: true,
    permission: "Access P2P Commission Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { tradeId, amount } = body;
    return await (0, query_1.storeRecord)({
        model: "p2pCommission",
        data: {
            tradeId,
            amount,
        },
    });
};
