"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a KYC application",
    operationId: "deleteKycApplication",
    tags: ["Admin", "CRM", "KYC"],
    parameters: (0, query_1.deleteRecordParams)("KYC application"),
    responses: (0, query_1.deleteRecordResponses)("KYC application"),
    permission: "Access KYC Application Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "kyc",
        id: params.id,
        query,
    });
};
