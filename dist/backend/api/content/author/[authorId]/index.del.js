"use strict";
// /server/api/posts/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes posts by IDs",
    operationId: "bulkDeletePosts",
    tags: ["Content", "Author", "Post"],
    parameters: [
        ...(0, query_1.commonBulkDeleteParams)("Posts"),
        {
            index: 0,
            name: "authorId",
            in: "path",
            description: "ID of the author",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of post IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Posts"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { body, query, user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { ids } = body;
    const { authorId } = params;
    return (0, query_1.handleBulkDelete)({
        model: "post",
        ids,
        query,
        where: { authorId },
    });
};
