"use strict";
// /api/mlmReferralRewards/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlmReferralRewardStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for MLM Referral Rewards",
    operationId: "getMlmReferralRewardStructure",
    tags: ["Admin", "MLM Referral Rewards"],
    responses: {
        200: {
            description: "Form structure for managing MLM Referral Rewards",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access MLM Referral Reward Management",
};
const mlmReferralRewardStructure = async () => {
    const conditions = await db_1.models.mlmReferralCondition.findAll({
        where: {
            status: true,
        },
    });
    const reward = {
        type: "input",
        label: "Reward Amount",
        name: "reward",
        placeholder: "Enter the reward amount",
        required: true,
        ts: "number",
        icon: "marketeq:reward",
    };
    const isClaimed = {
        type: "select",
        label: "Is Claimed?",
        name: "isClaimed",
        required: true,
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    const conditionId = {
        type: "select",
        label: "Condition",
        name: "conditionId",
        placeholder: "Select the condition",
        options: conditions.map((condition) => ({
            value: condition.id,
            label: condition.name,
        })),
        icon: "ci:list-check",
    };
    const referrerId = {
        type: "input",
        label: "Referrer ID",
        name: "referrerId",
        placeholder: "Enter the referrer's user ID",
        required: true,
        icon: "lets-icons:user-duotone",
    };
    return {
        reward,
        isClaimed,
        conditionId,
        referrerId,
    };
};
exports.mlmReferralRewardStructure = mlmReferralRewardStructure;
exports.default = async () => {
    const { reward, isClaimed, conditionId, referrerId } = await (0, exports.mlmReferralRewardStructure)();
    return {
        get: [reward, conditionId, referrerId, isClaimed],
        set: [reward, conditionId, referrerId, isClaimed],
    };
};
