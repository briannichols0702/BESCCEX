"use strict";
// /server/api/admin/support-tickets/[id].get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils"); // Assuming the schema is in a separate file.
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves a specific support ticket by ID",
    operationId: "getSupportTicketById",
    tags: ["Admin", "CRM", "Support Ticket"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the support ticket to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Support ticket details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.supportTicketSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Support ticket not found"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Support Ticket Management",
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("supportTicket", params.id, [
        {
            model: db_1.models.user,
            as: "agent",
            attributes: ["avatar", "firstName", "lastName", "lastLogin"],
        },
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
    ]);
};
