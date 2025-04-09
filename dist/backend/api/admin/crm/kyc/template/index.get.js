"use strict";
// /server/api/admin/kyc/templates/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all KYC templates with pagination and optional filtering",
    operationId: "listKycTemplates",
    tags: ["Admin", "CRM", "KYC Template"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Paginated list of KYC templates with detailed information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.baseKycTemplateSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("KYC Templates"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access KYC Template Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.kycTemplate,
        query,
        sortField: query.sortField || "id",
        includeModels: [
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
        ],
        timestamps: false,
    });
};
