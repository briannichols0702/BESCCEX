"use strict";
// /server/api/mlm/referral-rewards/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes MLM Referral Rewards by IDs",
    operationId: "bulkDeleteMlmReferralRewards",
    tags: ["Admin", "MLM", "Referral Rewards"],
    parameters: (0, query_1.commonBulkDeleteParams)("MLM Referral Rewards"),
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
                            description: "Array of MLM Referral Reward IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("MLM Referral Rewards"),
    requiresAuth: true,
    permission: "Access MLM Referral Reward Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "mlmReferralReward",
        ids,
        query,
    });
};
