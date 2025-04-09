"use strict";
// /server/api/forex/plans/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes Forex plans by IDs",
    operationId: "bulkDeleteForexPlans",
    tags: ["Admin", "Forex", "Plans"],
    parameters: (0, query_1.commonBulkDeleteParams)("Forex Plans"),
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
                            description: "Array of Forex plan IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Forex Plans"),
    requiresAuth: true,
    permission: "Access Forex Plan Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "forexPlan",
        ids,
        query,
    });
};
