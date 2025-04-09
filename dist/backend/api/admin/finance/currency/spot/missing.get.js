"use strict";
// /server/api/exchange/settings/fetch-missing-currencies.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Fetch Missing Currencies",
    operationId: "fetchMissingCurrencies",
    tags: ["Admin", "Settings", "Exchange"],
    description: "Fetches all active markets, extracts unique currencies, compares with active currencies in the database, and returns the missing ones with their IDs.",
    requiresAuth: true,
    responses: {
        200: {
            description: "Missing currencies fetched successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            missingCurrencies: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        currency: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Currencies"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Exchange Market Management",
};
exports.default = async (data) => {
    try {
        // Fetch all active markets
        const activeMarkets = await db_1.models.exchangeMarket.findAll({
            attributes: ["currency", "pair"],
            where: {
                status: true,
            },
        });
        // Extract unique currencies from markets
        const currencySet = new Set();
        activeMarkets.forEach((market) => {
            const { currency, pair } = market;
            currencySet.add(currency);
            currencySet.add(pair);
        });
        const marketCurrencies = Array.from(currencySet);
        // Fetch all currencies
        const allCurrencies = await db_1.models.exchangeCurrency.findAll({
            attributes: ["id", "currency", "status"],
        });
        const activeCurrencies = allCurrencies.filter((currency) => currency.status);
        const currencyList = activeCurrencies.map((currency) => currency.currency);
        // Find missing currencies
        const missingCurrencies = marketCurrencies
            .filter((currency) => !currencyList.includes(currency))
            .map((currency) => {
            const currencyRecord = allCurrencies.find((cur) => cur.currency === currency);
            if (currencyRecord && currencyRecord.id) {
                return { id: currencyRecord.id, currency };
            }
            return null;
        })
            .filter(Boolean); // Remove null entries
        return missingCurrencies;
    }
    catch (error) {
        return {
            status: 500,
            body: query_1.serverErrorResponse,
        };
    }
};
