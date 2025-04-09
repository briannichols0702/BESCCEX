"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific FAQ entry by ID",
    operationId: "getFaqById",
    tags: ["Admin", "FAQs"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the FAQ to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "FAQ entry details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseFaqSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("FAQ"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access FAQ Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("faq", params.id, [
        {
            model: db_1.models.faqCategory,
            as: "faqCategory",
        },
    ]);
};
