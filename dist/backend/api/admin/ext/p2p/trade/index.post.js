"use strict";
// /api/p2p/trades/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new P2P Trade",
    operationId: "storeP2PTrade",
    tags: ["Admin", "P2P", "Trades"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.p2pTradeUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.p2pTradeStoreSchema, "P2P Trade"),
    requiresAuth: true,
    permission: "Access P2P Trade Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, sellerId, offerId, amount, status, messages, txHash } = body;
    return await (0, query_1.storeRecord)({
        model: "p2pTrade",
        data: {
            userId,
            sellerId,
            offerId,
            amount,
            status,
            messages,
            txHash,
        },
    });
};
