"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const Websocket_1 = require("@b/handler/Websocket");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the status of a support ticket",
    operationId: "updateSupportTicketStatus",
    tags: ["Admin", "CRM", "Support Ticket"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the support ticket to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            description: "New status to apply",
                            enum: ["PENDING", "OPEN", "REPLIED", "CLOSED"],
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Support Ticket"),
    requiresAuth: true,
    permission: "Access Support Ticket Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    (0, Websocket_1.sendMessageToRoute)(`/api/user/support/ticket/${id}`, { id }, {
        method: "update",
        data: {
            status,
            updatedAt: new Date(),
        },
    });
    return (0, query_1.updateStatus)("supportTicket", id, status);
};
