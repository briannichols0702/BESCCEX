"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific FAQ",
    operationId: "updateFaq",
    tags: ["Admin", "FAQs"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the FAQ to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the FAQ",
        content: {
            "application/json": {
                schema: utils_1.faqUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("FAQ"),
    requiresAuth: true,
    permission: "Access FAQ Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { categoryId, question, answer, videoUrl } = body;
    return await (0, query_1.updateRecord)("faq", id, {
        categoryId,
        question,
        answer,
        videoUrl,
    });
};
