"use strict";
// /server/api/admin/support-tickets/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes support tickets by IDs",
    operationId: "bulkDeleteSupportTickets",
    tags: ["Admin", "CRM", "Support Ticket"],
    parameters: (0, query_1.commonBulkDeleteParams)("Support Tickets"),
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of support ticket IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Support Tickets"),
    requiresAuth: true,
    permission: "Access Support Ticket Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body.ids;
    await (0, query_1.handleBulkDelete)({
        model: "supportTicket",
        ids,
        query,
    });
    return {
        message: "Tickets deleted successfully",
    };
};
