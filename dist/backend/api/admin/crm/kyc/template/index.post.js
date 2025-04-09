"use strict";
// /api/admin/kyc/templates/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores or updates a KYC template",
    operationId: "storeKYCTemplate",
    tags: ["Admin", "CRM", "KYC Template"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: utils_1.kycTemplateStoreSchema,
                    required: ["title", "options"],
                },
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)({
        description: `KYC template processed successfully`,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: utils_1.baseKycTemplateSchema,
                },
            },
        },
    }, "KYC Template"),
    requiresAuth: true,
    permission: "Access KYC Template Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { title, options, customOptions } = body;
    return await (0, query_1.storeRecord)({
        model: "kycTemplate",
        data: {
            title,
            options,
            customOptions,
            status: false,
        },
    });
};
