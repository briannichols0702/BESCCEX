"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of ICO tokens",
    operationId: "bulkUpdateIcoTokenStatus",
    tags: ["Admin", "ICO Tokens"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of ICO token IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            enum: ["PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"],
                            description: "New status to apply to the ICO tokens",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("ICO Token"),
    requiresAuth: true,
    permission: "Access ICO Token Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    return (0, query_1.updateStatus)("icoToken", ids, status);
};
