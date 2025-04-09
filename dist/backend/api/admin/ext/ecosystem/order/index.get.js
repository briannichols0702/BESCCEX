"use strict";
// /server/api/admin/ecosystem/orders/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
const query_2 = require("@b/utils/eco/scylla/query");
const client_1 = require("@b/utils/eco/scylla/client");
exports.metadata = {
    summary: "List all ecosystem orders",
    operationId: "listEcosystemOrders",
    tags: ["Admin", "Ecosystem Orders"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Ecosystem orders retrieved successfully",
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
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem Orders"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Ecosystem Order Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_2.getPaginatedRecords)({
        keyspace: client_1.scyllaKeyspace,
        table: "orders",
        query,
        sortField: query.sortField || "createdAt",
    });
};
