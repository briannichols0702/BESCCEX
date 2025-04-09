"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.metadata = void 0;
// /server/api/blog/comments/delete.del.ts
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a blog comment",
    description: "This endpoint deletes a blog comment.",
    operationId: "deleteComment",
    tags: ["Blog"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the comment to delete",
            required: true,
            schema: {
                type: "string",
                description: "Comment ID",
            },
        },
    ],
    responses: (0, query_1.deleteRecordResponses)("Comment"),
};
exports.default = async (data) => {
    return deleteComment(data.params.id);
};
async function deleteComment(id) {
    await db_1.models.comment.destroy({
        where: { id },
    });
    return {
        message: "Comment deleted successfully",
    };
}
exports.deleteComment = deleteComment;
