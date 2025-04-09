"use strict";
// /api/stakingDurations/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingDurationStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Staking Durations",
    operationId: "getStakingDurationStructure",
    tags: ["Admin", "Staking Durations"],
    responses: {
        200: {
            description: "Form structure for managing Staking Durations",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Staking Duration Management"
};
const stakingDurationStructure = async () => {
    const pools = await db_1.models.stakingPool.findAll();
    const poolId = {
        type: "select",
        label: "Pool",
        name: "poolId",
        options: pools.map((pool) => ({
            value: pool.id,
            label: pool.name,
        })),
        placeholder: "Select the pool",
    };
    const duration = {
        type: "input",
        label: "Duration",
        name: "duration",
        placeholder: "Enter the duration in days",
        ts: "number",
    };
    const interestRate = {
        type: "input",
        label: "Interest Rate",
        name: "interestRate",
        placeholder: "Enter the interest rate (in %)",
        ts: "number",
    };
    return {
        poolId,
        duration,
        interestRate,
    };
};
exports.stakingDurationStructure = stakingDurationStructure;
exports.default = async () => {
    const { poolId, duration, interestRate } = await (0, exports.stakingDurationStructure)();
    return {
        get: [poolId, duration, interestRate],
        set: [poolId, [duration, interestRate]],
    };
};
