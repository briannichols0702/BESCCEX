"use strict";
// /server/api/admin/investment/plans/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes investment plans by IDs",
    operationId: "bulkDeleteInvestmentPlans",
    tags: ["Admin", "Investment Plans"],
    parameters: (0, query_1.commonBulkDeleteParams)("Investment Plans"),
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
                            description: "Array of investment plan IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Investment Plans"),
    requiresAuth: true,
    permission: "Access Investment Plan Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "investmentPlan",
        ids,
        query,
    });
};
