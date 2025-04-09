"use strict";
// /server/api/admin/notifications/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes notifications by IDs",
    operationId: "bulkDeleteNotifications",
    tags: ["Notifications"],
    parameters: (0, query_1.commonBulkDeleteParams)("Notifications"),
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
                            description: "Array of notification IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Notifications"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, body, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "notification",
        ids,
        query,
        where: { userId: user.id },
    });
};
