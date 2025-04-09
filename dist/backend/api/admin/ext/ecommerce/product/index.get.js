"use strict";
// /server/api/ecommerce/products/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecommerce products with pagination and optional filtering",
    operationId: "listEcommerceProducts",
    tags: ["Admin", "Ecommerce", "Products"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecommerce products with detailed information including associated categories, discounts, and reviews",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecommerceProductSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("E-commerce Products"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecommerce Product Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecommerceProduct,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.ecommerceCategory,
                as: "category",
                attributes: ["name"],
            },
            {
                model: db_1.models.ecommerceReview,
                as: "ecommerceReviews",
                attributes: ["rating", "comment"],
                required: false,
            },
        ],
        numericFields: ["price", "inventoryQuantity", "rating"],
    });
};
