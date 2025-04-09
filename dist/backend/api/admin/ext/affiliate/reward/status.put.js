"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the claimed status of MLM Referral Rewards",
    operationId: "bulkUpdateMlmReferralRewardStatus",
    tags: ["Admin", "MLM Referral Rewards"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of MLM Referral Reward IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "boolean",
                            description: "New claimed status to apply (true for claimed, false for unclaimed)",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("MLM Referral Reward"),
    requiresAuth: true,
    permission: "Access MLM Referral Reward Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    const isClaimed = status;
    return (0, query_1.updateStatus)("mlmReferralReward", ids, isClaimed, undefined, "Referral Reward");
};
