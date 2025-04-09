"use strict";
// /server/api/admin/binary/orders/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "List all binary orders",
    operationId: "listBinaryOrders",
    tags: ["Admin", "Binary Orders"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Binary orders retrieved successfully",
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
        404: (0, query_1.notFoundMetadataResponse)("Binary orders"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Binary Order Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.binaryOrder,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
};
