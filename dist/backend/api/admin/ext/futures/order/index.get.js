"use strict";
// backend/api/admin/ext/futures/order/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
const query_2 = require("@b/utils/eco/scylla/query");
const client_1 = require("@b/utils/eco/scylla/client");
exports.metadata = {
    summary: "List all futures orders",
    operationId: "listFuturesOrders",
    tags: ["Admin", "Futures Orders"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Futures orders retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.orderSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Futures Orders"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Futures Order Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_2.getPaginatedRecords)({
        keyspace: client_1.scyllaFuturesKeyspace,
        table: "orders",
        query,
        sortField: query.sortField || "createdAt",
    });
};
