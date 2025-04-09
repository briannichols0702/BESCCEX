"use strict";
// /server/api/ecommerce/Shipping/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecommerce Shipping with pagination and optional filtering",
    operationId: "listEcommerceShipping",
    tags: ["Admin", "Ecommerce", "Shipping"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecommerce Shipping with details about shipping items",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecommerceShippingchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("E-commerce Shipping"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecommerce Shipping Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecommerceShipping,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.ecommerceOrder,
                as: "ecommerceOrders",
                includeModels: [
                    {
                        model: db_1.models.ecommerceOrderItem,
                        as: "ecommerceOrderItems",
                        attributes: ["orderId", "productId", "quantity"],
                    },
                ],
            },
        ],
        numericFields: ["cost", "weight", "volume", "tax"],
    });
};
