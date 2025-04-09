"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status and importance of support tickets",
    operationId: "bulkUpdateSupportTicketsStatusImportance",
    tags: ["Admin", "CRM", "Support Ticket"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of support ticket IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            description: "New status to apply to support tickets",
                            enum: ["PENDING", "OPEN", "REPLIED", "CLOSED"],
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("SupportTicket"),
    requiresAuth: true,
    permission: "Access Support Ticket Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    return (0, query_1.updateStatus)("supportTicket", ids, status);
};
