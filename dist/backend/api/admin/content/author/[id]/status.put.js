"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the status of an Author",
    operationId: "updateAuthorStatus",
    tags: ["Admin", "Content", "Author"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the author to update",
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
                            enum: ["PENDING", "APPROVED", "REJECTED"],
                            description: "New status to set for the author",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Author"),
    requiresAuth: true,
    permission: "Access Author Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    return (0, query_1.updateStatus)("author", id, status);
};
