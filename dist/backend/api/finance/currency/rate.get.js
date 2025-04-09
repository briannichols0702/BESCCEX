"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/finance/currency/rate.get.ts
const error_1 = require("@b/utils/error");
const utils_1 = require("./utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Get exchange rate between two currencies",
    description: "Returns the exchange rate between two currencies given their wallet types.",
    operationId: "getExchangeRate",
    tags: ["Finance", "Currency"],
    parameters: [
        {
            name: "fromCurrency",
            in: "query",
            description: "The currency to convert from",
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            name: "fromType",
            in: "query",
            description: "The wallet type of the currency to convert from",
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            name: "toCurrency",
            in: "query",
            description: "The currency to convert to",
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            name: "toType",
            in: "query",
            description: "The wallet type of the currency to convert to",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requiresAuth: true,
    responses: {
        200: {
            description: "Exchange rate retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            ...utils_1.baseResponseSchema,
                            data: {
                                type: "number",
                                description: "Exchange rate from fromCurrency to toCurrency",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Currency"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { fromCurrency, fromType, toCurrency, toType } = query;
    if (!fromCurrency || !fromType || !toCurrency || !toType) {
        throw (0, error_1.createError)(400, "Missing required query parameters");
    }
    // If currencies and types are the same, rate is 1
    if (fromCurrency === toCurrency && fromType === toType) {
        return {
            status: true,
            message: "Exchange rate retrieved successfully",
            data: 1,
        };
    }
    // Get price in USD for fromCurrency
    let fromPriceUSD;
    switch (fromType) {
        case "FIAT":
            fromPriceUSD = await (0, utils_1.getFiatPriceInUSD)(fromCurrency);
            break;
        case "SPOT":
            fromPriceUSD = await (0, utils_1.getSpotPriceInUSD)(fromCurrency);
            break;
        case "ECO":
            fromPriceUSD = await (0, utils_1.getEcoPriceInUSD)(fromCurrency);
            break;
        default:
            throw (0, error_1.createError)(400, `Invalid fromType: ${fromType}`);
    }
    // Get price in USD for toCurrency
    let toPriceUSD;
    switch (toType) {
        case "FIAT":
            toPriceUSD = await (0, utils_1.getFiatPriceInUSD)(toCurrency);
            break;
        case "SPOT":
            toPriceUSD = await (0, utils_1.getSpotPriceInUSD)(toCurrency);
            break;
        case "ECO":
            toPriceUSD = await (0, utils_1.getEcoPriceInUSD)(toCurrency);
            break;
        default:
            throw (0, error_1.createError)(400, `Invalid toType: ${toType}`);
    }
    // Calculate exchange rate: rate = toPriceUSD / fromPriceUSD
    const rate = toPriceUSD / fromPriceUSD;
    return rate;
};
