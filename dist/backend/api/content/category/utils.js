"use strict";
// utils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryPostsSchema = exports.basePostSchema = exports.baseCategorySchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseCategorySchema = {
    id: (0, schema_1.baseStringSchema)("Category ID"),
    name: (0, schema_1.baseStringSchema)("Name of the category"),
    slug: (0, schema_1.baseStringSchema)("Slug for the category"),
    image: (0, schema_1.baseStringSchema)("Image URL for the category", 255, 0, true),
    description: (0, schema_1.baseStringSchema)("Description of the category", 255, 0, true),
};
exports.basePostSchema = {
    id: (0, schema_1.baseStringSchema)("Post ID"),
    title: (0, schema_1.baseStringSchema)("Title of the post"),
    content: (0, schema_1.baseStringSchema)("Content of the post"),
    categoryId: (0, schema_1.baseStringSchema)("Category ID of the post"),
    authorId: (0, schema_1.baseStringSchema)("Author ID of the post"),
    slug: (0, schema_1.baseStringSchema)("Slug of the post"),
    description: (0, schema_1.baseStringSchema)("Description of the post", 255, 0, true),
    status: (0, schema_1.baseEnumSchema)("Status of the post", ["PUBLISHED", "DRAFT", "TRASH"]),
    image: (0, schema_1.baseStringSchema)("Image URL of the post", 255, 0, true),
    createdAt: (0, schema_1.baseDateTimeSchema)("Creation date of the post"),
    updatedAt: (0, schema_1.baseDateTimeSchema)("Last update date of the post", true),
};
exports.categoryPostsSchema = {
    type: "array",
    items: {
        type: "object",
        properties: exports.basePostSchema,
    },
    nullable: true,
};
