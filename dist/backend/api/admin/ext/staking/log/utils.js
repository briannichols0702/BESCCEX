"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingLogStoreSchema = exports.stakingLogUpdateSchema = exports.stakingLogSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the staking log");
const userId = (0, schema_1.baseStringSchema)("User ID of the staker");
const poolId = (0, schema_1.baseStringSchema)("ID of the staking pool");
const durationId = (0, schema_1.baseStringSchema)("ID of the staking duration");
const amount = (0, schema_1.baseNumberSchema)("Amount staked");
const status = (0, schema_1.baseEnumSchema)("Current status of the staking log", [
    "ACTIVE",
    "RELEASED",
    "COLLECTED",
]);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the staking log");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the staking log");
exports.stakingLogSchema = {
    id,
    userId,
    poolId,
    durationId,
    amount,
    status,
    createdAt,
    updatedAt,
};
exports.stakingLogUpdateSchema = {
    type: "object",
    properties: {
        userId,
        poolId,
        durationId,
        amount,
        status,
    },
    required: ["userId", "poolId", "durationId", "amount", "status"],
};
exports.stakingLogStoreSchema = {
    description: `Staking log created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.stakingLogSchema,
            },
        },
    },
};
