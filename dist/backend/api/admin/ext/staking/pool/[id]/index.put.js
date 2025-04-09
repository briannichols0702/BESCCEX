"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Staking Pool",
    operationId: "updateStakingPool",
    tags: ["Admin", "Staking"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the Staking Pool to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Staking Pool",
        required: true,
        content: {
            "application/json": {
                schema: utils_1.stakingPoolUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("StakingPool"),
    requiresAuth: true,
    permission: "Access Staking Pool Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        name: body.name,
        description: body.description,
        currency: body.currency ? body.currency.toUpperCase() : undefined,
        chain: body.chain ? body.chain.toUpperCase() : undefined,
        type: body.type,
        minStake: body.minStake,
        maxStake: body.maxStake,
        status: body.status,
        icon: body.icon,
    };
    return await (0, query_1.updateRecord)("stakingPool", id, updatedFields);
};
