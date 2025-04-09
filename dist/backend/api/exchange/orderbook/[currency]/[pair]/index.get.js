"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/exchange/utils");
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const query_1 = require("@b/utils/query");
const utils_2 = require("@b/api/exchange/utils");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Get Market Order Book",
    operationId: "getMarketOrderBook",
    tags: ["Exchange", "Markets"],
    description: "Retrieves the order book for a specific market pair.",
    parameters: [
        {
            name: "currency",
            in: "path",
            description: "Currency symbol",
            required: true,
            schema: { type: "string" },
        },
        {
            name: "pair",
            in: "path",
            description: "Pair symbol",
            required: true,
            schema: { type: "string" },
        },
        {
            name: "limit",
            in: "query",
            description: "Limit the number of order book entries",
            schema: { type: "number" },
        },
    ],
    responses: {
        200: {
            description: "Order book information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseOrderBookSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Orderbook"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { currency, pair } = data.params;
    const limit = data.query.limit ? parseInt(data.query.limit, 10) : undefined;
    try {
        // Check for ban status
        const unblockTime = await (0, utils_2.loadBanStatus)();
        if (await (0, utils_2.handleBanStatus)(unblockTime)) {
            throw (0, error_1.createError)(503, "Service temporarily unavailable. Please try again later.");
        }
        const exchange = await exchange_1.default.startExchange();
        if (!exchange) {
            throw (0, error_1.createError)(503, "Service temporarily unavailable. Please try again later.");
        }
        const orderBook = await exchange.fetchOrderBook(`${currency}/${pair}`, limit);
        return {
            asks: orderBook.asks,
            bids: orderBook.bids,
        };
    }
    catch (error) {
        console.error(`Failed to fetch order book: ${error.message}`);
        if (error.statusCode === 503) {
            throw error;
        }
        throw (0, error_1.createError)(500, "Unable to fetch order book at this time");
    }
};
