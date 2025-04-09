"use strict";
// /api/admin/comments/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Get form structure for Comments",
    operationId: "getCommentStructure",
    tags: ["Admin", "Content", "Comment"],
    responses: {
        200: {
            description: "Form structure for managing Comments",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Comment Management",
};
const commentStructure = async () => {
    const posts = await db_1.models.post.findAll();
    const content = {
        type: "textarea",
        label: "Content",
        name: "content",
        placeholder: "Enter the content of the comment",
    };
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the associated user ID",
    };
    const postId = {
        type: "select",
        label: "Post",
        name: "postId",
        options: posts.map((post) => ({
            value: post.id,
            label: post.title,
        })),
        placeholder: "Select the associated post",
    };
    return {
        content,
        userId,
        postId,
    };
};
exports.commentStructure = commentStructure;
exports.default = async () => {
    const { content, userId, postId } = await (0, exports.commentStructure)();
    return {
        get: [content],
        set: [content],
    };
};
