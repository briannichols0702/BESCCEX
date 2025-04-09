"use strict";
// /api/stakingLogs/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingLogStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Staking Logs",
    operationId: "getStakingLogStructure",
    tags: ["Admin", "Staking Logs"],
    responses: {
        200: {
            description: "Form structure for managing Staking Logs",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Staking Management"
};
const stakingLogStructure = async () => {
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
    const durations = await db_1.models.stakingDuration.findAll();
    const durationId = {
        type: "select",
        label: "Duration",
        name: "durationId",
        options: durations.map((duration) => ({
            value: duration.id,
            label: `${duration.duration > 1 ? duration.duration + " days" : "1 day"}`,
        })),
        placeholder: "Select the duration",
    };
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const amount = {
        type: "input",
        label: "Amount",
        name: "amount",
        placeholder: "Enter the staked amount",
        ts: "number",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "ACTIVE", label: "Active" },
            { value: "RELEASED", label: "Released" },
            { value: "COLLECTED", label: "Collected" },
        ],
        placeholder: "Select the status",
    };
    return {
        userId,
        poolId,
        durationId,
        amount,
        status,
    };
};
exports.stakingLogStructure = stakingLogStructure;
exports.default = async () => {
    const { userId, poolId, durationId, amount, status } = await (0, exports.stakingLogStructure)();
    return {
        get: [userId, poolId, durationId, amount, status],
        set: [userId, [poolId, durationId], [amount, status]],
    };
};
