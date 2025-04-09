"use strict";
// /api/admin/faqs/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new FAQ",
    operationId: "storeFaq",
    tags: ["Admin", "FAQs"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.faqUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.faqStoreSchema, "FAQ"),
    requiresAuth: true,
    permission: "Access FAQ Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { faqCategoryId, question, answer, videoUrl } = body;
    return await (0, query_1.storeRecord)({
        model: "faq",
        data: {
            faqCategoryId,
            question,
            answer,
            videoUrl,
        },
    });
};
