"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Retrieves all active staking pools",
    description: "Fetches a list of all active staking pools available for staking.",
    operationId: "listActivePools",
    tags: ["Staking", "Pools"],
    requiresAuth: true,
    responses: {
        200: {
            description: "Staking pools retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseStakingPoolSchema,
                        },
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
    const { user } = data;
    let where = {};
    if (user === null || user === void 0 ? void 0 : user.id) {
        where = { userId: user.id };
    }
    return await db_1.models.stakingPool.findAll({
        where: { status: "ACTIVE" },
        include: [
            { model: db_1.models.stakingDuration, as: "stakingDurations" },
            {
                model: db_1.models.stakingLog,
                as: "stakingLogs",
                where: { status: "ACTIVE", ...where },
                required: false,
                include: [{ model: db_1.models.stakingDuration, as: "duration" }],
            },
        ],
    });
};
