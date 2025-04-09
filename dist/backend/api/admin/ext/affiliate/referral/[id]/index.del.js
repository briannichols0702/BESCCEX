"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific MLM Referral",
    operationId: "deleteMlmReferral",
    tags: ["Admin", "MLM", "Referrals"],
    parameters: (0, query_1.deleteRecordParams)("MLM Referral"),
    responses: (0, query_1.deleteRecordResponses)("MLM Referral"),
    permission: "Access MLM Referral Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "mlmReferral",
        id: params.id,
        query,
    });
};
