"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves a specific staking pool",
    description: "Fetches details of a specific staking pool by ID.",
    operationId: "getPoolDetails",
    tags: ["Staking", "Pools"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Staking pool ID" },
        },
    ],
    responses: {
        200: {
            description: "Staking pool retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseStakingPoolSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Staking Pool"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params } = data;
    const { id } = params;
    const pool = await db_1.models.stakingPool.findOne({
        where: { id },
        include: [{ model: db_1.models.stakingDuration, as: "stakingDurations" }],
    });
    if (!pool) {
        throw (0, error_1.createError)({ statusCode: 404, message: "Staking pool not found" });
    }
    return pool;
};
