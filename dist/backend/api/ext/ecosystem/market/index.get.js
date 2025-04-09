"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Retrieves all ecosystem markets",
    description: "Fetches a list of all active markets available in the ecosystem.",
    operationId: "listEcosystemMarkets",
    tags: ["Ecosystem", "Markets"],
    responses: {
        200: {
            description: "Markets retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseMarketSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Market"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async () => {
    const markets = await db_1.models.ecosystemMarket.findAll({
        where: { status: true },
    });
    return markets;
};
