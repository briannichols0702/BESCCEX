"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of Mailwizard Campaigns",
    operationId: "bulkUpdateMailwizardCampaignStatus",
    tags: ["Admin", "Mailwizard Campaigns"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of Mailwizard Campaign IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "PAUSED",
                                "ACTIVE",
                                "STOPPED",
                                "COMPLETED",
                                "CANCELLED",
                            ],
                            description: "New status to apply to the Mailwizard Campaigns",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Mailwizard Campaign"),
    requiresAuth: true,
    permission: "Access Mailwizard Campaign Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    return (0, query_1.updateStatus)("mailwizardCampaign", ids, status);
};
