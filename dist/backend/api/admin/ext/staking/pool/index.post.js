"use strict";
// /api/staking/pools/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Staking Pool",
    operationId: "storeStakingPool",
    tags: ["Admin", "Staking", "Pools"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.stakingPoolUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.stakingPoolStoreSchema, "Staking Pool"),
    requiresAuth: true,
    permission: "Access Staking Pool Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, description, currency, chain, type, minStake, maxStake, status, icon, } = body;
    return await (0, query_1.storeRecord)({
        model: "stakingPool",
        data: {
            name,
            description,
            currency: currency ? currency.toUpperCase() : undefined,
            chain: chain ? chain.toUpperCase() : undefined,
            type,
            minStake,
            maxStake,
            status,
            icon,
        },
    });
};
