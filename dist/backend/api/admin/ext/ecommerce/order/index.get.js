"use strict";
// /server/api/ecommerce/orders/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecommerce orders with pagination and optional filtering",
    operationId: "listEcommerceOrders",
    tags: ["Admin", "Ecommerce", "Orders"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecommerce orders with details about order items and the user",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecommerceOrderSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("E-commerce Orders"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecommerce Order Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecommerceOrder,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.ecommerceProduct,
                as: "products",
                through: {
                    attributes: ["quantity"],
                },
                attributes: ["name", "price", "status"],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: db_1.models.ecommerceShippingAddress,
                as: "shippingAddress",
                required: false,
            },
        ],
    });
};
