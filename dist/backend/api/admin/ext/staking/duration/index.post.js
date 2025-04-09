"use strict";
// /api/staking/durations/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Staking Duration",
    operationId: "storeStakingDuration",
    tags: ["Admin", "Staking", "Durations"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.stakingDurationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.stakingDurationStoreSchema, "Staking Duration"),
    requiresAuth: true,
    permission: "Access Staking Duration Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { poolId, duration, interestRate } = body;
    return await (0, query_1.storeRecord)({
        model: "stakingDuration",
        data: {
            poolId,
            duration,
            interestRate,
        },
    });
};
