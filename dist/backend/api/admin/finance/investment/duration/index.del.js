"use strict";
// /server/api/investment/durations/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes Investment durations by IDs",
    operationId: "bulkDeleteInvestmentDurations",
    tags: ["Admin", "Investment", "Durations"],
    parameters: (0, query_1.commonBulkDeleteParams)("Investment Durations"),
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
                            description: "Array of Investment duration IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Investment Durations"),
    requiresAuth: true,
    permission: "Access Investment Duration Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "investmentDuration",
        ids,
        query,
    });
};
