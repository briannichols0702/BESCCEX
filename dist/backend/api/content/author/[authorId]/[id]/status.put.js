"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Update Status for a Post",
    operationId: "updatePostStatus",
    tags: ["Content", "Author", "Post"],
    parameters: [
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
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Post to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            enum: ["PUBLISHED", "DRAFT", "TRASH"],
                            description: "New status to apply to the Post",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Post"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { body, params, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { id, authorId } = params;
    const { status } = body;
    return (0, query_1.updateStatus)("post", id, status, undefined, undefined, undefined, {
        authorId,
    });
};
