"use strict";
// /server/api/ico/tokens/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes ICO tokens by IDs",
    operationId: "bulkDeleteIcoTokens",
    tags: ["Admin", "ICO", "Tokens"],
    parameters: (0, query_1.commonBulkDeleteParams)("ICO Tokens"),
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
                            description: "Array of ICO token IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("ICO Tokens"),
    requiresAuth: true,
    permission: "Access ICO Token Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "icoToken",
        ids,
        query,
    });
};
