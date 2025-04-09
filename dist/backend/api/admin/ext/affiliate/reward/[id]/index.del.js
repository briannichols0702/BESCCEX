"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific MLM Referral Reward",
    operationId: "deleteMlmReferralReward",
    tags: ["Admin", "MLM", "Referral Rewards"],
    parameters: (0, query_1.deleteRecordParams)("MLM Referral Reward"),
    responses: (0, query_1.deleteRecordResponses)("MLM Referral Reward"),
    permission: "Access MLM Referral Reward Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "mlmReferralReward",
        id: params.id,
        query,
    });
};
