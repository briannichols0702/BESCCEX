"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/support-tickets/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const Websocket_1 = require("@b/handler/Websocket");
exports.metadata = {
    summary: "Updates an existing support ticket",
    operationId: "updateSupportTicket",
    tags: ["Admin", "CRM", "Support Ticket"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the support ticket to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the support ticket",
        content: {
            "application/json": {
                schema: utils_1.supportTicketUpdateSchema,
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
    const { subject, importance, status, type } = body;
    const payload = {
        id,
    };
    (0, Websocket_1.sendMessageToRoute)(`/api/user/support/ticket/${id}`, payload, {
        method: "update",
        data: {
            status,
            updatedAt: new Date(),
        },
    });
    return await (0, query_1.updateRecord)("supportTicket", id, {
        subject,
        importance,
        status,
        type,
    });
};
