"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "List all FAQ categories",
    description: "Retrieves a list of all FAQ categories along with their associated FAQs.",
    operationId: "listCategories",
    tags: ["FAQ"],
    responses: {
        200: {
            description: "FAQ categories retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseFAQCategorySchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Faq Category"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async () => {
    const categories = await db_1.models.faqCategory.findAll({
        include: [
            {
                model: db_1.models.faq,
                as: "faqs",
            },
        ],
    });
    return categories;
};
