"use strict";
// /server/api/support/tickets/show.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicket = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Retrieves a single ticket details for the logged-in user",
    description: "Fetches detailed information about a specific support ticket identified by its ID, including associated chat details.",
    operationId: "getTicket",
    tags: ["Support"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the ticket to retrieve",
            schema: { type: "number" },
        },
    ],
    responses: {
        200: {
            description: "Ticket details retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            status: {
                                type: "boolean",
                                description: "Indicates if the request was successful",
                            },
                            statusCode: {
                                type: "number",
                                description: "HTTP status code",
                                example: 200,
                            },
                            data: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        description: "ID of the ticket",
                                    },
                                    userId: {
                                        type: "string",
                                        description: "ID of the user who created the ticket",
                                    },
                                    agentId: {
                                        type: "string",
                                        description: "ID of the agent assigned to the ticket",
                                    },
                                    subject: {
                                        type: "string",
                                        description: "Subject of the ticket",
                                    },
                                    importance: {
                                        type: "string",
                                        description: "Importance level of the ticket",
                                    },
                                    status: {
                                        type: "string",
                                        description: "Status of the ticket",
                                    },
                                    messages: {
                                        type: "object",
                                        description: "Messages associated with the chat",
                                    },
                                    createdAt: {
                                        type: "string",
                                        format: "date-time",
                                        description: "Date and time the ticket was created",
                                    },
                                    updatedAt: {
                                        type: "string",
                                        format: "date-time",
                                        description: "Date and time the ticket was updated",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Support Ticket"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    var _a;
    if (!((_a = data.user) === null || _a === void 0 ? void 0 : _a.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    return getTicket(data.user.id, data.params.id);
};
// Get a specific ticket
async function getTicket(userId, id) {
    const ticket = await db_1.models.supportTicket.findOne({
        where: { id, userId },
        include: [
            {
                model: db_1.models.user,
                as: "agent",
                attributes: ["avatar", "firstName", "lastName", "lastLogin"],
            },
        ],
    });
    if (!ticket) {
        throw (0, error_1.createError)({
            message: "Ticket not found",
            statusCode: 404,
        });
    }
    return ticket.get({ plain: true });
}
exports.getTicket = getTicket;
