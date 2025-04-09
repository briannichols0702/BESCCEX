"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/notifications/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates an existing notification template",
    operationId: "updateNotificationTemplate",
    tags: ["Admin", "Notifications"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the notification template to update",
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the notification template",
        content: {
            "application/json": {
                schema: utils_1.notificationTemplateUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Notification Template"),
    requiresAuth: true,
    permission: "Access Notification Template Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { subject, emailBody, smsBody, pushBody, email, sms, push } = body;
    return await (0, query_1.updateRecord)("notificationTemplate", id, {
        subject,
        emailBody,
        smsBody,
        pushBody,
        email,
        sms,
        push,
    });
};
