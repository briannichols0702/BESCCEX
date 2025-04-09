"use strict";
// /server/api/forex/investments/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes Forex investments by IDs",
    operationId: "bulkDeleteForexInvestments",
    tags: ["Admin", "Forex", "Investments"],
    parameters: (0, query_1.commonBulkDeleteParams)("Forex Investments"),
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
                            description: "Array of Forex investment IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Forex Investments"),
    requiresAuth: true,
    permission: "Access Forex Investment Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "forexInvestment",
        ids,
        query,
    });
};
