"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Staking Log",
    operationId: "updateStakingLog",
    tags: ["Admin", "Staking"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the Staking Log to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Staking Log",
        required: true,
        content: {
            "application/json": {
                schema: utils_1.stakingLogUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("StakingLog"),
    requiresAuth: true,
    permission: "Access Staking Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        userId: body.userId,
        poolId: body.poolId,
        durationId: body.durationId,
        amount: body.amount,
        status: body.status,
    };
    return await (0, query_1.updateRecord)("stakingLog", id, updatedFields);
};
