"use strict";
// /server/api/admin/notifications/templates/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Lists all notification templates with pagination and optional filtering",
    operationId: "listNotificationTemplates",
    tags: ["Admin", "Notifications"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Paginated list of notification templates with details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "string",
                                            description: "ID of the notification template",
                                        },
                                        name: {
                                            type: "string",
                                            description: "Name of the notification template",
                                        },
                                        subject: {
                                            type: "string",
                                            description: "Subject of the notification template",
                                        },
                                        emailBody: {
                                            type: "string",
                                            description: "Email body of the notification template",
                                        },
                                        smsBody: {
                                            type: "string",
                                            description: "SMS body of the notification template",
                                        },
                                        pushBody: {
                                            type: "string",
                                            description: "Push notification body of the notification template",
                                        },
                                        shortCodes: {
                                            type: "object",
                                            description: "Short codes available for the template",
                                        },
                                        email: {
                                            type: "boolean",
                                            description: "Whether this template is used for emails",
                                        },
                                        sms: {
                                            type: "boolean",
                                            description: "Whether this template is used for SMS",
                                        },
                                        push: {
                                            type: "boolean",
                                            description: "Whether this template is used for push notifications",
                                        },
                                    },
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, permission required to view notification templates",
        },
        500: { description: "Internal server error" },
    },
    requiresAuth: true,
    permission: "Access Notification Template Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.notificationTemplate,
        query,
        sortField: query.sortField || "name",
        timestamps: false,
    });
};
