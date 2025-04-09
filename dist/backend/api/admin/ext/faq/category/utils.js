"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseFaqCategorySchema = exports.faqCategorySchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the FAQ category");
const faqItem = {
    type: "object",
    properties: {
        id: (0, schema_1.baseStringSchema)("ID of the FAQ"),
        question: (0, schema_1.baseStringSchema)("Question text"),
        answer: (0, schema_1.baseStringSchema)("Answer text"),
    },
};
exports.faqCategorySchema = {
    id,
    faqs: {
        type: "array",
        items: faqItem,
    },
};
exports.baseFaqCategorySchema = {
    id,
};
