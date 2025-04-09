"use strict";
// /server/api/support/tickets/close.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const Websocket_1 = require("@b/handler/Websocket");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Closes a support ticket",
    description: "Closes a support ticket identified by its UUID.",
    operationId: "closeTicket",
    tags: ["Support"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "The UUID of the ticket to close",
            schema: { type: "string" },
        },
    ],
    responses: (0, query_1.updateRecordResponses)("Support Ticket"),
};
exports.default = async (data) => {
    const { id } = data.params;
    await db_1.models.supportTicket.update({
        status: "CLOSED",
    }, {
        where: { id },
    });
    const ticket = await db_1.models.supportTicket.findOne({
        where: { id },
    });
    if (!ticket) {
        throw new Error("Ticket not found");
    }
    const payload = {
        id: ticket.id,
    };
    (0, Websocket_1.sendMessageToRoute)(`/api/user/support/ticket/${id}`, payload, {
        method: "update",
        data: {
            status: "CLOSED",
            updatedAt: new Date(),
        },
    });
    return {
        message: "Ticket closed successfully",
    };
};
