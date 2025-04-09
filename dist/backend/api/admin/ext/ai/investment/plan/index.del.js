"use strict";
// /server/api/ai/investment-plans/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes AI Investment Plans by IDs",
    operationId: "bulkDeleteAIInvestmentPlans",
    tags: ["Admin", "AI Investment Plan"],
    parameters: (0, query_1.commonBulkDeleteParams)("AI Investment Plans"),
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
                            description: "Array of AI Investment Plan IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("AI Investment Plans"),
    requiresAuth: true,
    permission: "Access AI Investment Plan Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "aiInvestmentPlan",
        ids,
        query,
    });
};
