"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of MLM Referrals",
    operationId: "bulkUpdateMlmReferralStatus",
    tags: ["Admin", "MLM Referrals"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of MLM Referral IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            enum: ["PENDING", "ACTIVE", "REJECTED"],
                            description: "New status to apply to the MLM Referrals",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("MLM Referral"),
    requiresAuth: true,
    permission: "Access MLM Referral Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    return (0, query_1.updateStatus)("mlmReferral", ids, status);
};
