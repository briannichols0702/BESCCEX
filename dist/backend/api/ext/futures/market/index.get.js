"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Retrieves all futures markets",
    description: "Fetches a list of all active futures markets.",
    operationId: "listFuturesMarkets",
    tags: ["Futures", "Markets"],
    responses: {
        200: {
            description: "Futures markets retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseFuturesMarketSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Futures Market"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async () => {
    const markets = await db_1.models.futuresMarket.findAll({
        where: { status: true },
    });
    return markets;
};
