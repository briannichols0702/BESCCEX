"use strict";
// /server/api/ecommerce/categories/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all e-commerce categories with pagination and optional filtering",
    operationId: "listEcommerceCategories",
    tags: ["Admin", "Ecommerce", "Categories"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of e-commerce categories with optional related products and pagination",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecommerceCategorySchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("E-commerce Categories"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecommerce Category Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecommerceCategory,
        query,
        sortField: query.sortField || "name",
    });
};
