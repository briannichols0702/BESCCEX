"use strict";
// /server/api/forex/signals/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes Forex signals by IDs",
    operationId: "bulkDeleteForexSignals",
    tags: ["Admin", "Forex", "Signals"],
    parameters: (0, query_1.commonBulkDeleteParams)("Forex Signals"),
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
                            description: "Array of Forex signal IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Forex Signals"),
    requiresAuth: true,
    permission: "Access Forex Signal Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "forexSignal",
        ids,
        query,
    });
};
