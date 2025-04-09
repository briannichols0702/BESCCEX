"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoricalOHLCV = exports.metadata = void 0;
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const utils_2 = require("../utils");
exports.metadata = {
    summary: "Get Historical Chart Data",
    operationId: "getHistoricalChartData",
    tags: ["Chart", "Historical"],
    description: "Retrieves historical chart data for the authenticated user.",
    parameters: [
        {
            name: "symbol",
            in: "query",
            description: "Symbol to retrieve data for.",
            required: true,
            schema: { type: "string" },
        },
        {
            name: "interval",
            in: "query",
            description: "Interval to retrieve data for.",
            required: true,
            schema: { type: "string" },
        },
        {
            name: "from",
            in: "query",
            description: "Start timestamp to retrieve data from.",
            required: true,
            schema: { type: "number" },
        },
        {
            name: "to",
            in: "query",
            description: "End timestamp to retrieve data from.",
            required: true,
            schema: { type: "number" },
        },
        {
            name: "duration",
            in: "query",
            description: "Duration to retrieve data for.",
            required: true,
            schema: { type: "number" },
        },
    ],
    responses: {
        200: {
            description: "Historical chart data retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseChartDataPointSchema,
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
    return getHistoricalOHLCV(query.symbol, query.interval, Number(query.from), Number(query.to), Number(query.duration));
};
async function getHistoricalOHLCV(symbol, interval, from, to, duration, maxRetries = 3, retryDelay = 1000) {
    // Check for ban status
    const unblockTime = await (0, utils_2.loadBanStatus)();
    if (await (0, utils_2.handleBanStatus)(unblockTime)) {
        return await (0, utils_1.getCachedOHLCV)(symbol, interval, from, to);
    }
    const exchange = await exchange_1.default.startExchange();
    if (!exchange) {
        return [];
    }
    const cachedData = await (0, utils_1.getCachedOHLCV)(symbol, interval, from, to);
    const expectedBars = Math.ceil((to - from) / (0, utils_1.intervalToMilliseconds)(interval));
    if (cachedData.length === expectedBars) {
        return cachedData;
    }
    const missingIntervals = (0, utils_1.findGapsInCachedData)(cachedData, from, to, interval);
    const currentTimestamp = Date.now();
    const intervalMs = (0, utils_1.intervalToMilliseconds)(interval);
    for (const { gapStart, gapEnd } of missingIntervals) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (await (0, utils_2.handleBanStatus)(await (0, utils_2.loadBanStatus)())) {
                    return cachedData;
                }
                // Adjust gapEnd to skip the current ongoing bar
                const adjustedGapEnd = gapEnd > currentTimestamp - intervalMs
                    ? currentTimestamp - intervalMs
                    : gapEnd;
                const data = await exchange.fetchOHLCV(symbol, interval, gapStart, 500, { until: adjustedGapEnd });
                await (0, utils_1.saveOHLCVToCache)(symbol, interval, data);
                break;
            }
            catch (e) {
                if (attempt < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                    retryDelay *= 2;
                }
                else {
                    throw new Error("Unable to fetch historical data at this time");
                }
            }
        }
    }
    return await (0, utils_1.getCachedOHLCV)(symbol, interval, from, to);
}
exports.getHistoricalOHLCV = getHistoricalOHLCV;
