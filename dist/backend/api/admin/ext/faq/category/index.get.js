"use strict";
// /server/api/faq/categories/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all FAQ categories with optional detailed FAQs",
    operationId: "listFAQCategories",
    tags: ["Admin", "FAQ"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of FAQ categories with optional FAQs included",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.faqCategorySchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("FAQ Categories"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access FAQ Category Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.faqCategory,
        query,
        sortField: query.sortField || "id",
        timestamps: false,
        includeModels: [
            {
                model: db_1.models.faq,
                as: "faqs",
                attributes: ["id", "question", "answer"],
            },
        ],
    });
};
