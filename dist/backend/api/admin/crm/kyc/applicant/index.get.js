"use strict";
// /server/api/admin/kyc/applications/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all KYC applications with pagination and optional filtering",
    operationId: "listKycApplications",
    tags: ["Admin", "CRM", "KYC"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Paginated list of KYC applications with detailed user and template information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.kycApplicationSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("KYC Applications"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access KYC Application Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.kyc,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: db_1.models.kycTemplate,
                as: "template",
                attributes: ["id", "title"],
            },
        ],
    });
};
