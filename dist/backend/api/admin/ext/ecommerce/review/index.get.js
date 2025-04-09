"use strict";
// /server/api/ecommerce/reviews/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecommerce reviews with pagination and optional filtering",
    operationId: "listEcommerceReviews",
    tags: ["Admin", "Ecommerce", "Reviews"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecommerce reviews with details about the product and the user",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecommerceReviewSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("E-commerce Reviews"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecommerce Review Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecommerceReview,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.ecommerceProduct,
                as: "product",
                attributes: ["id", "name", "price", "status", "image"],
                includeModels: [
                    {
                        model: db_1.models.ecommerceCategory,
                        as: "category",
                        attributes: ["name"],
                    },
                ],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
        numericFields: ["rating"],
    });
};
