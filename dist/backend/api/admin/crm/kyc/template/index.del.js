"use strict";
// /server/api/kyc/templates/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes KYC templates by IDs",
    operationId: "bulkDeleteKycTemplates",
    tags: ["Admin", "CRM", "KYC Template"],
    parameters: (0, query_1.commonBulkDeleteParams)("KYC Templates"),
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
                            description: "Array of KYC template IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("KYC Templates"),
    requiresAuth: true,
    permission: "Access KYC Template Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "kycTemplate",
        ids,
        query,
    });
};
