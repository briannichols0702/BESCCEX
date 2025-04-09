"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific Staking Log by ID",
    operationId: "getStakingLogById",
    tags: ["Admin", "Staking Logs"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Staking Log to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Staking Log details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.stakingLogSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Staking Log"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Staking Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("stakingLog", params.id, [
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.stakingPool,
            as: "pool",
            attributes: ["id", "name", "status", "icon"],
        },
    ]);
};
