"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists staking pools with pagination and optional filtering",
    operationId: "listStakingPools",
    tags: ["Admin", "Staking", "Pools"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of staking pools with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.stakingPoolSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Staking Pools"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Staking Pool Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Utilize the generic fetch function with options specific to staking pools
    return (0, query_1.getFiltered)({
        model: db_1.models.stakingPool,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.stakingDuration,
                as: "stakingDurations",
                attributes: ["id", "duration", "interestRate"],
            },
            {
                model: db_1.models.stakingLog,
                as: "stakingLogs",
                attributes: ["id", "amount", "createdAt", "status"],
            },
        ],
    });
};
