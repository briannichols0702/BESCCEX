"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const redis_1 = require("@b/utils/redis");
const query_1 = require("@b/utils/query");
const matchingEngine_1 = require("@b/utils/futures/matchingEngine");
const utils_1 = require("../order/utils");
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
    const engine = await matchingEngine_1.FuturesMatchingEngine.getInstance();
    const tickers = await engine.getTickers();
    return tickers;
};
