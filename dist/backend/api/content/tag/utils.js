"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagPostsSchema = exports.basePostTagSchema = exports.baseTagSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseTagSchema = {
    id: (0, schema_1.baseStringSchema)("Tag ID"),
    name: (0, schema_1.baseStringSchema)("Name of the tag"),
    slug: (0, schema_1.baseStringSchema)("Slug for the tag"),
};
exports.basePostTagSchema = {
    type: "object",
    properties: {
        id: (0, schema_1.baseStringSchema)("Post ID"),
        title: (0, schema_1.baseStringSchema)("Title of the post"),
        content: (0, schema_1.baseStringSchema)("Content of the post"),
        authorId: (0, schema_1.baseStringSchema)("Author ID of the post"),
        categoryId: (0, schema_1.baseStringSchema)("Category ID of the post"),
        slug: (0, schema_1.baseStringSchema)("Slug of the post"),
        createdAt: (0, schema_1.baseDateTimeSchema)("Creation date of the post"),
        updatedAt: (0, schema_1.baseDateTimeSchema)("Last update date of the post", true),
    },
};
exports.tagPostsSchema = {
    type: "array",
    items: exports.basePostTagSchema,
};
