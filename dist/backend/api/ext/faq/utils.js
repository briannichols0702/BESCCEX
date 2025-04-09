"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseFAQCategorySchema = exports.baseFAQSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseFAQSchema = {
    id: (0, schema_1.baseNumberSchema)("FAQ ID"),
    question: (0, schema_1.baseStringSchema)("FAQ question"),
    answer: (0, schema_1.baseStringSchema)("FAQ answer"),
    categoryId: (0, schema_1.baseNumberSchema)("Category ID"),
    videoUrl: (0, schema_1.baseStringSchema)("FAQ video URL"),
};
exports.baseFAQCategorySchema = {
    id: (0, schema_1.baseNumberSchema)("Category ID"),
    title: (0, schema_1.baseStringSchema)("Category title"),
    categoryId: (0, schema_1.baseStringSchema)("Category id"),
    faqs: {
        type: "array",
        description: "List of FAQs in this category",
        items: {
            type: "object",
            properties: exports.baseFAQSchema,
        },
    },
};
