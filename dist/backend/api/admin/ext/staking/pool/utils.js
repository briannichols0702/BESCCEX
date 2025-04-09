"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingPoolStoreSchema = exports.stakingPoolUpdateSchema = exports.baseStakingPoolSchema = exports.stakingPoolSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the staking pool");
const name = (0, schema_1.baseStringSchema)("Name of the staking pool");
const description = (0, schema_1.baseStringSchema)("Description of the staking pool");
const currency = (0, schema_1.baseStringSchema)("Currency used in the staking pool");
const chain = (0, schema_1.baseStringSchema)("Blockchain chain associated with the staking pool", 255, 0, true);
const type = (0, schema_1.baseEnumSchema)("Type of wallet used for staking", [
    "FIAT",
    "SPOT",
    "ECO",
]);
const minStake = (0, schema_1.baseNumberSchema)("Minimum stake amount");
const maxStake = (0, schema_1.baseNumberSchema)("Maximum stake amount");
const status = (0, schema_1.baseEnumSchema)("Status of the staking pool", [
    "ACTIVE",
    "INACTIVE",
    "COMPLETED",
]);
const icon = (0, schema_1.baseStringSchema)("Icon URL of the staking pool", 1000, 0, true);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the staking pool");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the staking pool");
const deletedAt = (0, schema_1.baseDateTimeSchema)("Deletion date of the staking pool", true);
exports.stakingPoolSchema = {
    id,
    name,
    description,
    currency,
    chain,
    type,
    minStake,
    maxStake,
    status,
    icon,
    createdAt,
    updatedAt,
};
exports.baseStakingPoolSchema = {
    id,
    name,
    description,
    currency,
    chain,
    type,
    minStake,
    maxStake,
    status,
    icon,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.stakingPoolUpdateSchema = {
    type: "object",
    properties: {
        name,
        description,
        currency,
        chain,
        type,
        minStake,
        maxStake,
        status,
        icon,
    },
    required: [
        "name",
        "description",
        "currency",
        "type",
        "minStake",
        "maxStake",
        "status",
    ],
};
exports.stakingPoolStoreSchema = {
    description: `Staking Pool created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseStakingPoolSchema,
            },
        },
    },
};
