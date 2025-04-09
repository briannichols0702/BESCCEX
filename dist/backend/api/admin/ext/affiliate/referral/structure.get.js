"use strict";
// /api/mlmReferrals/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlmReferralStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for MLM Referrals",
    operationId: "getMlmReferralStructure",
    tags: ["Admin", "MLM Referrals"],
    responses: {
        200: {
            description: "Form structure for managing MLM Referrals",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access MLM Referral Management",
};
const mlmReferralStructure = () => {
    const referrerId = {
        type: "input",
        label: "Referrer ID",
        name: "referrerId",
        placeholder: "Enter the referrer's user ID",
        icon: "lets-icons:user-duotone",
    };
    const referredId = {
        type: "input",
        label: "Referred ID",
        name: "referredId",
        placeholder: "Enter the referred user's ID",
        icon: "lets-icons:user-duotone",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "ACTIVE", label: "Active" },
            { value: "REJECTED", label: "Rejected" },
        ],
        placeholder: "Select the referral status",
        required: true,
        icon: "lets-icons:status",
    };
    return {
        referrerId,
        referredId,
        status,
    };
};
exports.mlmReferralStructure = mlmReferralStructure;
exports.default = () => {
    const { referrerId, referredId, status } = (0, exports.mlmReferralStructure)();
    return {
        get: [referrerId, referredId, status],
        set: [referrerId, referredId, status],
    };
};
