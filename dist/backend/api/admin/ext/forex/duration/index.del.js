"use strict";
// /server/api/forex/durations/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes Forex durations by IDs",
    operationId: "bulkDeleteForexDurations",
    tags: ["Admin", "Forex", "Durations"],
    parameters: (0, query_1.commonBulkDeleteParams)("Forex Durations"),
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
                            description: "Array of Forex duration IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Forex Durations"),
    requiresAuth: true,
    permission: "Access Forex Duration Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "forexDuration",
        ids,
        query,
    });
};
