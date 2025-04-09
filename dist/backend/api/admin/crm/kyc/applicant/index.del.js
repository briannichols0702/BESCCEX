"use strict";
// /server/api/kyc/applications/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes KYC applications by IDs",
    operationId: "bulkDeleteKycApplications",
    tags: ["Admin", "CRM", "KYC"],
    parameters: (0, query_1.commonBulkDeleteParams)("KYC Applications"),
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
                            description: "Array of KYC application IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("KYC Applications"),
    requiresAuth: true,
    permission: "Access KYC Application Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "kyc",
        ids,
        query,
    });
};
