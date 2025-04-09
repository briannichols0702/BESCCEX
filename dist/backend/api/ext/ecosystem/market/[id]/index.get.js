"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves a specific ecosystem market",
    description: "Fetches details of a specific market in the ecosystem.",
    operationId: "getEcosystemMarket",
    tags: ["Ecosystem", "Markets"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "number", description: "Market ID" },
        },
    ],
    responses: {
        200: {
            description: "Market details retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseMarketSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Market"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params } = data;
    const { id } = params;
    const market = await db_1.models.ecosystemMarket.findOne({
        where: { id },
        attributes: ["id", "name", "status"],
    });
    if (!market)
        throw (0, error_1.createError)({ statusCode: 404, message: "Market not found" });
    return market;
};
