"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a support ticket",
    operationId: "deleteSupportTicket",
    tags: ["Admin", "CRM", "Support Ticket"],
    parameters: (0, query_1.deleteRecordParams)("support ticket"),
    responses: (0, query_1.deleteRecordResponses)("Support Ticket"),
    permission: "Access Support Ticket Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    const { id } = params;
    await (0, query_1.handleSingleDelete)({
        model: "supportTicket",
        id,
        query,
    });
    return {
        message: "Ticket restored successfully",
    };
};
