"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/kyc/templates/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates an existing KYC template",
    operationId: "updateKycTemplate",
    tags: ["Admin", "CRM", "KYC Template"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the KYC template to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the KYC template",
        content: {
            "application/json": {
                schema: utils_1.kycTemplateUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("KYC Template"),
    requiresAuth: true,
    permission: "Access KYC Template Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { title, options, customOptions } = body;
    return await (0, query_1.updateRecord)("kycTemplate", id, {
        title,
        options,
        customOptions,
    });
};
