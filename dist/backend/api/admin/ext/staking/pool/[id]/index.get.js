"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific Staking Pool by ID",
    operationId: "getStakingPoolById",
    tags: ["Admin", "Staking Pools"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Staking Pool to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Staking Pool details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseStakingPoolSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Staking Pool"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Staking Pool Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("stakingPool", params.id, [
        {
            model: db_1.models.stakingDuration,
            as: "stakingDurations",
        },
        {
            model: db_1.models.stakingLog,
            as: "stakingLogs",
        },
    ]);
};
