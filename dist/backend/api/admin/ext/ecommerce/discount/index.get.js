"use strict";
// /server/api/ecommerce/discounts/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecommerce discounts with pagination and optional filtering",
    operationId: "listEcommerceDiscounts",
    tags: ["Admin", "Ecommerce", "Discounts"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecommerce discounts with product details and pagination",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecommerceDiscountSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("E-commerce Discounts"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecommerce Discount Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecommerceDiscount,
        query,
        sortField: query.sortField || "validUntil",
        numericFields: ["percentage"],
        includeModels: [
            {
                model: db_1.models.ecommerceProduct,
                as: "product",
                attributes: ["image", "name"],
                includeModels: [
                    {
                        model: db_1.models.ecommerceCategory,
                        as: "category",
                        attributes: ["name"],
                    },
                ],
            },
        ],
    });
};
