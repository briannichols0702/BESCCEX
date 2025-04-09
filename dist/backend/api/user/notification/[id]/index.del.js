"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/admin/notifications/index.delete.ts
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific notification",
    operationId: "deleteNotification",
    tags: ["Notifications"],
    parameters: (0, query_1.deleteRecordParams)("notification"), // Assumes your function is designed to handle this input
    responses: (0, query_1.deleteRecordResponses)("notification"), // Assumes this function provides standardized responses
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, params, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    return (0, query_1.handleSingleDelete)({
        model: "notification",
        id: params.id,
        query,
        where: { userId: user.id },
    });
};
