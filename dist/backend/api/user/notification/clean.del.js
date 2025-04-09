"use strict";
// /server/api/admin/notifications/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "delete all notifications",
    operationId: "bulkDeleteNotifications",
    tags: ["Notifications"],
    parameters: [
        {
            in: "query",
            name: "type",
            description: "Type of notification",
            schema: {
                type: "string",
            },
        },
    ],
    responses: (0, query_1.commonBulkDeleteResponses)("Notifications"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { type } = query;
    await db_1.models.notification.destroy({
        where: { userId: user.id, type },
    });
    return { message: "Notifications deleted" };
};
