"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the claimed status of an MLM Referral Reward",
    operationId: "updateMlmReferralRewardStatus",
    tags: ["Admin", "MLM Referral Rewards"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the MLM referral reward to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "boolean",
                            description: "New claimed status to apply (true for claimed, false for unclaimed)",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("MLM Referral Reward"),
    requiresAuth: true,
    permission: "Access MLM Referral Reward Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    const isClaimed = status;
    return (0, query_1.updateStatus)("mlmReferralReward", id, isClaimed, undefined, "Referral Reward");
};
