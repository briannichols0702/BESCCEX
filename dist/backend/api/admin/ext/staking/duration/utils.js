"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingDurationStoreSchema = exports.stakingDurationUpdateSchema = exports.baseStakingDurationSchema = exports.stakingDurationSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the staking duration");
const poolId = (0, schema_1.baseStringSchema)("ID of the staking pool");
const duration = (0, schema_1.baseNumberSchema)("Duration in days");
const interestRate = (0, schema_1.baseNumberSchema)("Interest rate per annum");
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the staking duration");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the staking duration");
exports.stakingDurationSchema = {
    id,
    poolId,
    duration,
    interestRate,
    createdAt,
    updatedAt,
};
exports.baseStakingDurationSchema = {
    id,
    poolId,
    duration,
    interestRate,
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the staking duration, if applicable"),
};
exports.stakingDurationUpdateSchema = {
    type: "object",
    properties: {
        poolId,
        duration,
        interestRate,
    },
    required: ["poolId", "duration", "interestRate"],
};
exports.stakingDurationStoreSchema = {
    description: `Staking duration created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.stakingDurationSchema,
            },
        },
    },
};
