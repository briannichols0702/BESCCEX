"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqStoreSchema = exports.faqUpdateSchema = exports.baseFaqSchema = exports.faqSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the FAQ");
const faqCategoryId = (0, schema_1.baseStringSchema)("FAQ Category ID associated with the FAQ");
const question = (0, schema_1.baseStringSchema)("Question text of the FAQ", 5000);
const answer = (0, schema_1.baseStringSchema)("Answer text of the FAQ", 5000);
const videoUrl = (0, schema_1.baseStringSchema)("Video URL of the FAQ");
exports.faqSchema = {
    id,
    faqCategoryId,
    question,
    answer,
    videoUrl,
};
exports.baseFaqSchema = {
    id,
    faqCategoryId,
    question,
    answer,
    videoUrl,
};
exports.faqUpdateSchema = {
    type: "object",
    properties: {
        faqCategoryId,
        question,
        answer,
        videoUrl,
    },
    required: ["faqCategoryId", "question", "answer"],
};
exports.faqStoreSchema = {
    description: `FAQ created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseFaqSchema,
            },
        },
    },
};
