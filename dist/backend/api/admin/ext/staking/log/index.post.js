"use strict";
// /api/staking/logs/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Staking Log",
    operationId: "storeStakingLog",
    tags: ["Admin", "Staking", "Logs"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.stakingLogUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.stakingLogStoreSchema, "Staking Log"),
    requiresAuth: true,
    permission: "Access Staking Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, poolId, durationId, amount, status } = body;
    return await (0, query_1.storeRecord)({
        model: "stakingLog",
        data: {
            userId,
            poolId,
            durationId,
            amount,
            status,
        },
    });
};
