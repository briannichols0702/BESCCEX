"use strict";
// utils/schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseAuthorSchema = exports.baseAuthorPropertiesSchema = exports.basePostItemSchema = exports.baseUserObjectSchema = exports.baseStatusSchema = exports.baseUserIdSchema = exports.baseIdSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseIdSchema = (0, schema_1.baseStringSchema)("Generic ID");
exports.baseUserIdSchema = (0, schema_1.baseStringSchema)("User ID associated with the entity");
exports.baseStatusSchema = (0, schema_1.baseEnumSchema)("Current status", [
    "PENDING",
    "APPROVED",
    "REJECTED",
]);
exports.baseUserObjectSchema = {
    type: "object",
    properties: {
        id: exports.baseIdSchema,
        firstName: (0, schema_1.baseStringSchema)("First name of the user"),
        lastName: (0, schema_1.baseStringSchema)("Last name of the user"),
        avatar: (0, schema_1.baseStringSchema)("Avatar URL of the user", 255, 0, true),
    },
};
exports.basePostItemSchema = {
    type: "object",
    properties: {
        id: exports.baseIdSchema,
        title: (0, schema_1.baseStringSchema)("Title of the post"),
        content: (0, schema_1.baseStringSchema)("Content of the post"),
        categoryId: exports.baseIdSchema,
        authorId: exports.baseIdSchema,
        slug: (0, schema_1.baseStringSchema)("Slug of the post"),
        description: (0, schema_1.baseStringSchema)("Description of the post", 255, 0, true),
        status: (0, schema_1.baseEnumSchema)("Post status", ["PUBLISHED", "DRAFT", "TRASH"]),
        image: (0, schema_1.baseStringSchema)("Image URL of the post", 255, 0, true),
        createdAt: (0, schema_1.baseDateTimeSchema)("Creation date of the post"),
        updatedAt: (0, schema_1.baseDateTimeSchema)("Last update date of the post", true),
    },
};
exports.baseAuthorPropertiesSchema = {
    id: exports.baseIdSchema,
    userId: exports.baseUserIdSchema,
    status: exports.baseStatusSchema,
    user: exports.baseUserObjectSchema,
    posts: {
        type: "array",
        items: exports.basePostItemSchema,
        nullable: true,
    },
};
exports.baseAuthorSchema = {
    type: "object",
    properties: exports.baseAuthorPropertiesSchema,
};
