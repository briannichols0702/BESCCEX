"use strict";
// /server/api/admin/kyc/applications/[id].get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils"); // Assuming the schema is in a separate file.
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves a specific KYC application by ID",
    operationId: "getKycApplicationById",
    tags: ["Admin", "CRM", "KYC"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the KYC application to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "KYC application details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.kycApplicationSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("KYC application not found"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access KYC Application Management",
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("kyc", params.id, [
        {
            model: db_1.models.user,
            as: "user",
            attributes: [
                "id",
                "email",
                "firstName",
                "lastName",
                "phone",
                "profile",
                "createdAt",
                "updatedAt",
            ],
        },
        {
            model: db_1.models.kycTemplate,
            as: "template",
        },
    ]);
};
