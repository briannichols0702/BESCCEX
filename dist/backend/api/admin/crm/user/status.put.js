"use strict";
// /server/api/admin/users/update-status/bulk.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of users",
    operationId: "bulkUpdateUserStatus",
    tags: ["Admin", "CRM", "User"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of user IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            description: "New status to apply",
                            enum: ["ACTIVE", "INACTIVE", "BANNED"],
                        },
                    },
                    required: ["users", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("User"),
    requiresAuth: true,
    permission: "Access User Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { ids } = params;
    const { status } = body;
    return (0, query_1.updateStatus)("user", ids, status);
};
