"use strict";
// /server/api/mailwizard/campaigns/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes Mailwizard campaigns by IDs",
    operationId: "bulkDeleteMailwizardCampaigns",
    tags: ["Admin", "Mailwizard", "Campaigns"],
    parameters: (0, query_1.commonBulkDeleteParams)("Mailwizard Campaigns"),
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
                            description: "Array of Mailwizard campaign IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Mailwizard Campaigns"),
    requiresAuth: true,
    permission: "Access Mailwizard Campaign Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "mailwizardCampaign",
        ids,
        query,
    });
};
