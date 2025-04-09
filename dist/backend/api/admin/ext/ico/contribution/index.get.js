"use strict";
// /server/api/ico/contributions/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ICO Contributions with pagination and optional filtering",
    operationId: "listIcoContributions",
    tags: ["Admin", "ICO", "Contributions"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ICO Contributions with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.icoContributionSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("ICO Contributions"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access ICO Contribution Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.icoContribution,
        query,
        sortField: query.sortField || "createdAt",
        customStatus: [
            {
                key: "status",
                true: "COMPLETED",
                false: "PENDING",
            },
        ],
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: db_1.models.icoPhase,
                as: "phase",
                attributes: ["id", "name"],
                includeModels: [
                    {
                        model: db_1.models.icoToken,
                        as: "token",
                        attributes: ["name", "currency", "chain", "image"],
                    },
                ],
            },
        ],
        numericFields: ["amount"],
    });
};
