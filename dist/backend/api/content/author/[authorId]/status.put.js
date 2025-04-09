"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of Posts",
    operationId: "bulkUpdatePostStatus",
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
                            description: "Array of Post IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            enum: ["PUBLISHED", "DRAFT", "TRASH"],
                            description: "New status to apply to the Posts",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Post"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { body, user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { ids, status } = body;
    const { authorId } = params;
    return (0, query_1.updateStatus)("post", ids, status, undefined, undefined, undefined, {
        authorId,
    });
};
