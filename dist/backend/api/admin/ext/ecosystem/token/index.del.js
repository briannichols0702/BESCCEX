"use strict";
// /server/api/ecosystem/tokens/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes ecosystem tokens by IDs",
    operationId: "bulkDeleteEcosystemTokens",
    tags: ["Admin", "Ecosystem", "Tokens"],
    parameters: (0, query_1.commonBulkDeleteParams)("Ecosystem Tokens"),
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
                            description: "Array of ecosystem token IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Ecosystem Tokens"),
    requiresAuth: true,
    permission: "Access Ecosystem Token Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "ecosystemToken",
        ids,
        query,
    });
};
