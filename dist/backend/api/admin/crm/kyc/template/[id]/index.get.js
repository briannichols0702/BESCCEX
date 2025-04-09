"use strict";
// /server/api/admin/kyc/templates/[id].get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils"); // Assuming the schema is in a separate file.
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves a specific KYC template by ID",
    operationId: "getKycTemplateById",
    tags: ["Admin", "CRM", "KYC Template"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the KYC template to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "KYC template details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.kycTemplateSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("KYC template not found"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access KYC Template Management",
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("kycTemplate", params.id, [
        {
            model: db_1.models.kyc,
            as: "kycs",
            attributes: [
                "id",
                "userId",
                "templateId",
                "data",
                "status",
                "level",
                "notes",
            ],
        },
    ]);
};
