"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentPostsSchema = exports.basePostCommentSchema = exports.baseCommentSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseCommentSchema = {
    id: (0, schema_1.baseStringSchema)("Comment ID"),
    name: (0, schema_1.baseStringSchema)("Name associated with the comment"),
    slug: (0, schema_1.baseStringSchema)("Slug for the comment"),
};
exports.basePostCommentSchema = {
    type: "object",
    properties: {
        id: (0, schema_1.baseStringSchema)("Post ID"),
        content: (0, schema_1.baseStringSchema)("Content of the post"),
        userId: (0, schema_1.baseStringSchema)("User ID of the poster"),
        postId: (0, schema_1.baseStringSchema)("ID of the post commented on"),
        createdAt: (0, schema_1.baseDateTimeSchema)("Creation date of the comment"),
        updatedAt: (0, schema_1.baseDateTimeSchema)("Last update date of the comment"),
        deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the comment", true),
    },
};
exports.commentPostsSchema = {
    type: "array",
    items: exports.basePostCommentSchema,
};
