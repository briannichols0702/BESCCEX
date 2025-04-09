"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Staking Duration",
    operationId: "updateStakingDuration",
    tags: ["Admin", "Staking"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the Staking Duration to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Staking Duration",
        required: true,
        content: {
            "application/json": {
                schema: utils_1.stakingDurationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("StakingDuration"),
    requiresAuth: true,
    permission: "Access Staking Duration Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        poolId: body.poolId,
        duration: body.duration,
        interestRate: body.interestRate,
    };
    return await (0, query_1.updateRecord)("stakingDuration", id, updatedFields);
};
