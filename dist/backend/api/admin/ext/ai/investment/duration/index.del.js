"use strict";
// /server/api/ai/investment-durations/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes AI Investment Durations by IDs",
    operationId: "bulkDeleteAIInvestmentDurations",
    tags: ["Admin", "AI Investment Duration"],
    parameters: (0, query_1.commonBulkDeleteParams)("AI Investment Durations"),
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
                            description: "Array of AI Investment Duration IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("AI Investment Durations"),
    requiresAuth: true,
    permission: "Access AI Investment Duration Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "aiInvestmentDuration",
        ids,
        query,
    });
};
