"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Futures Market",
    operationId: "storeFuturesMarket",
    tags: ["Admin", "Futures Markets"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.FuturesMarketUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.FuturesMarketStoreSchema, "Futures Market"),
    requiresAuth: true,
    permission: "Access Futures Market Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { currency, pair, isTrending, isHot, metadata } = body;
    return await (0, query_1.storeRecord)({
        model: "futuresMarket",
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
