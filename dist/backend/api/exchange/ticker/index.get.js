"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const redis_1 = require("@b/utils/redis");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const error_1 = require("@b/utils/error");
const redis = redis_1.RedisSingleton.getInstance();
exports.metadata = {
    summary: "Get All Market Tickers",
    operationId: "getAllMarketTickers",
    tags: ["Exchange", "Markets"],
    description: "Retrieves ticker information for all available market pairs.",
    responses: {
        200: {
            description: "All market tickers information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseTickerSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ticker"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async () => {
    const cachedData = await redis.get("exchange:tickers");
    if (!cachedData) {
        throw (0, error_1.createError)(404, "No tickers found in cache");
    }
    const tickers = JSON.parse(cachedData || "{}");
    return tickers;
};
