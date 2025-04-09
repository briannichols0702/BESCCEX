"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/blog/comments/store.post.ts
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new blog comment",
    description: "This endpoint creates a new blog comment.",
    operationId: "createComment",
    tags: ["Blog"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "postId",
            in: "path",
            description: "The ID of the post to comment on",
            required: true,
            schema: {
                type: "string",
                description: "Post ID",
            },
        },
    ],
    requestBody: {
        description: "Data for creating a new comment",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        content: {
                            type: "string",
                            description: "Name of the comment to create",
                        },
                    },
                    required: ["content"],
                },
            },
        },
        required: true,
    },
    responses: (0, query_1.createRecordResponses)("Comment"),
};
exports.default = async (data) => {
    const { user, body, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        return (0, error_1.createError)(401, "Unauthorized, permission required to create comments");
    }
    const { content } = body;
    if (!content) {
        return (0, error_1.createError)(400, "Comment content is required");
    }
    const { postId } = params;
    try {
        // Create the comment
        const newComment = await db_1.models.comment.create({
            content,
            userId: user.id,
            postId,
        });
        // Fetch the comment along with the associated user
        const commentWithUser = await db_1.models.comment.findOne({
            where: { id: newComment.id },
            include: [
                {
                    model: db_1.models.user,
                    as: "user",
                    attributes: ["firstName", "lastName", "email", "avatar"],
                },
            ],
        });
        if (!commentWithUser) {
            return (0, error_1.createError)(404, "Comment created but not found");
        }
        return {
            message: "Comment created successfully",
        };
    }
    catch (error) {
        console.error("Failed to create and retrieve comment:", error);
        return (0, error_1.createError)(500, "Internal server error");
    }
};
