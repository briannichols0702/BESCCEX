"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific Staking Duration by ID",
    operationId: "getStakingDurationById",
    tags: ["Admin", "Staking Durations"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Staking Duration to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Staking Duration details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseStakingDurationSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Staking Duration"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Staking Duration Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("stakingDuration", params.id, [
        {
            model: db_1.models.stakingPool,
            as: "pool",
            attributes: ["id", "name", "status"],
        },
    ]);
};
