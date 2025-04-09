"use strict";
// /server/api/faq/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all FAQs with pagination and optional filtering",
    operationId: "listFAQs",
    tags: ["Admin", "FAQ"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of FAQs with category details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.faqSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("FAQs"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access FAQ Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.faq,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.faqCategory,
                as: "faqCategory",
            },
        ],
    });
};
