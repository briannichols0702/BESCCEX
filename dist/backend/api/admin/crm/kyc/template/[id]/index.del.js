"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a KYC template",
    operationId: "deleteKycTemplate",
    tags: ["Admin", "CRM", "KYC Template"],
    parameters: (0, query_1.deleteRecordParams)("KYC template"),
    responses: (0, query_1.deleteRecordResponses)("KYC Template"),
    permission: "Access KYC Template Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "kycTemplate",
        id: params.id,
        query,
    });
};
