"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves a single email notification template by ID",
    operationId: "getNotificationTemplate",
    tags: ["Admin", "Notifications"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the template to retrieve",
            required: true,
            schema: {
                type: "number",
            },
        },
    ],
    permission: "Access Notification Template Management",
    responses: {
        200: {
            description: "Notification template retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "number",
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
                                description: "Push body of the notification template",
                            },
                            shortCodes: {
                                type: "object",
                                description: "Short codes for the notification template",
                            },
                            email: {
                                type: "boolean",
                                description: "Whether the notification template is for email",
                            },
                            sms: {
                                type: "boolean",
                                description: "Whether the notification template is for SMS",
                            },
                            push: {
                                type: "boolean",
                                description: "Whether the notification template is for push notifications",
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, permission required to view notification",
        },
        404: {
            description: "Template not found",
        },
        500: {
            description: "Internal server error",
        },
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const response = await db_1.models.notificationTemplate.findOne({
        where: {
            id: data.params.id,
        },
    });
    if (!response) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Template not found",
        });
    }
    return response;
};
