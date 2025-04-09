"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("./../order/utils");
const queries_1 = require("@b/utils/eco/scylla/queries");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Retrieves historical data for a specific symbol",
    description: "Fetches historical price data based on the specified interval and date range.",
    operationId: "getHistoricalData",
    tags: ["Market", "Historical"],
    parameters: [
        {
            name: "symbol",
            in: "query",
            required: true,
            schema: { type: "string", description: "Trading symbol, e.g., BTC/USD" },
        },
        {
            name: "from",
            in: "query",
            required: true,
            schema: {
                type: "number",
                description: "Start timestamp for historical data",
            },
        },
        {
            name: "to",
            in: "query",
            required: true,
            schema: {
                type: "number",
                description: "End timestamp for historical data",
            },
        },
        {
            name: "interval",
            in: "query",
            required: true,
            schema: {
                type: "string",
                description: "Time interval for the data, e.g., 1m, 5m, 1h",
            },
        },
    ],
    responses: {
        200: {
            description: "Historical data retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseHistoricalDataSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Chart"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { query } = data;
    const { symbol, from, to, interval } = query;
    if (!from || !to || !interval) {
        throw new Error("Both `from`, `to`, and `interval` must be provided.");
    }
    const bars = await (0, queries_1.getHistoricalCandles)(symbol, interval, Number(from), Number(to));
    return bars;
};
