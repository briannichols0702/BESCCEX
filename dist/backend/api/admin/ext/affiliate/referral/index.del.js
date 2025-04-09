"use strict";
// /server/api/mlm/referrals/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes MLM Referrals by IDs",
    operationId: "bulkDeleteMlmReferrals",
    tags: ["Admin", "MLM", "Referrals"],
    parameters: (0, query_1.commonBulkDeleteParams)("MLM Referrals"),
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
                            description: "Array of MLM Referral IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("MLM Referrals"),
    requiresAuth: true,
    permission: "Access MLM Referral Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "mlmReferral",
        ids,
        query,
    });
};
