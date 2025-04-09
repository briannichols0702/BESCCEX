"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves a specific futures market",
    description: "Fetches details of a specific futures market.",
    operationId: "getFuturesMarket",
    tags: ["Futures", "Markets"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Futures Market ID" },
        },
    ],
    responses: {
        200: {
            description: "Futures market details retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseFuturesMarketSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Futures Market"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params } = data;
    const { id } = params;
    const market = await db_1.models.futuresMarket.findOne({
        where: { id },
        attributes: ["id", "currency", "pair", "status"],
    });
    if (!market)
        throw (0, error_1.createError)({ statusCode: 404, message: "Futures market not found" });
    return market;
};
