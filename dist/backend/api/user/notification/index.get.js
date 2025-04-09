"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "List all notifications",
    description: "Retrieves a paginated list of all notifications for users.",
    operationId: "getNotifications",
    tags: ["Notifications"],
    parameters: constants_1.crudParameters, // Includes pagination and filtering parameters
    responses: {
        200: {
            description: "Notifications retrieved successfully",
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
                                        id: { type: "string", description: "Notification ID" },
                                        type: { type: "string", description: "Notification type" },
                                        title: {
                                            type: "string",
                                            description: "Notification title",
                                        },
                                        message: {
                                            type: "string",
                                            description: "Notification message",
                                        },
                                        link: {
                                            type: "string",
                                            description: "Link associated with the notification",
                                        },
                                        createdAt: {
                                            type: "string",
                                            format: "date-time",
                                            description: "Creation date of the notification",
                                        },
                                        updatedAt: {
                                            type: "string",
                                            format: "date-time",
                                            description: "Last update date of the notification",
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
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Notifications"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    return (0, query_1.getFiltered)({
        model: db_1.models.notification,
        query,
        where: { userId: user.id },
        sortField: query.sortField || "createdAt",
        paranoid: false,
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["id", "avatar", "firstName", "lastName"],
            },
        ],
    });
};
