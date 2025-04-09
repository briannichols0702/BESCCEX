"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new support ticket",
    description: "Creates a new support ticket for the currently authenticated user",
    operationId: "createTicket",
    tags: ["Support"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        subject: {
                            type: "string",
                            description: "Subject of the ticket",
                        },
                        message: {
                            type: "string",
                            description: "Content of the ticket",
                        },
                        importance: {
                            type: "string",
                            description: "Importance level of the ticket",
                            enum: ["LOW", "MEDIUM", "HIGH"],
                        },
                    },
                    required: ["subject", "message", "importance"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Support Ticket"),
};
exports.default = async (data) => {
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { subject, message, importance } = body;
    await db_1.models.supportTicket.create({
        userId: user.id,
        subject,
        messages: [
            {
                type: "client",
                text: message,
                time: new Date(),
                userId: user.id,
            },
        ],
        importance,
        status: "PENDING",
        type: "TICKET",
    });
    return { message: "Ticket created successfully" };
};
