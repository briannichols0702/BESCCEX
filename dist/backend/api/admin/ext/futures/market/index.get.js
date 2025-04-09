"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/admin/finance/exchange/market/utils");
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Lists all futures market entries with pagination and optional filtering",
    operationId: "listFuturesMarkets",
    tags: ["Admin", "Futures", "Markets"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of futures markets with optional details on trending status and metadata",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.marketSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Futures Markets"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Futures Market Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.futuresMarket,
        query,
        sortField: query.sortField || "currency",
    });
};
