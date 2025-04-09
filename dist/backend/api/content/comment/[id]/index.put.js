"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.metadata = void 0;
// /server/api/blog/comments/update.put.ts
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates an existing blog comment",
    description: "This endpoint updates an existing blog comment.",
    operationId: "updateComment",
    tags: ["Blog"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the comment to update",
            required: true,
            schema: {
                type: "string",
                description: "Comment ID",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Comment data to update",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        comment: { type: "string", description: "Updated comment content" },
                    },
                    required: ["comment"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Comment"),
};
exports.default = async (data) => {
    return updateComment(data.params.id, data.body.comment);
};
async function updateComment(id, data) {
    await db_1.models.comment.update(data, {
        where: { id },
    });
    const comment = await db_1.models.comment.findByPk(id);
    if (!comment) {
        throw (0, error_1.createError)(404, "Comment not found");
    }
    return {
        ...comment.get({ plain: true }),
        message: "Comment updated successfully",
    };
}
exports.updateComment = updateComment;
