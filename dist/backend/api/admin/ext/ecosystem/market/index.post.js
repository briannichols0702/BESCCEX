"use strict";
// /api/admin/ecosystem/markets/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("@b/api/admin/finance/exchange/market/utils");
exports.metadata = {
    summary: "Stores a new Ecosystem Market",
    operationId: "storeEcosystemMarket",
    tags: ["Admin", "Ecosystem Markets"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.MarketUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.MarketStoreSchema, "Ecosystem Market"),
    requiresAuth: true,
    permission: "Access Ecosystem Market Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { currency, pair, isTrending, isHot, metadata } = body;
    return await (0, query_1.storeRecord)({
        model: "ecosystemMarket",
        data: {
            currency,
            pair,
            isTrending,
            isHot,
            metadata,
            status: true,
        },
    });
};
