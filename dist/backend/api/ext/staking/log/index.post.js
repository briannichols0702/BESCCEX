"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const utils_1 = require("./utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Stakes tokens into a specified staking pool",
    description: "Allows a user to stake tokens by specifying a pool, amount, and duration.",
    operationId: "stakeTokens",
    tags: ["Staking"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        poolId: { type: "string", description: "ID of the staking pool" },
                        durationId: {
                            type: "string",
                            description: "ID of the staking duration",
                        },
                        amount: {
                            type: "number",
                            description: "Amount of tokens to stake",
                        },
                    },
                    required: ["poolId", "amount", "durationId"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Stake"),
};
exports.default = async (data) => {
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { poolId, amount, durationId } = body;
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk)
        throw new Error("User not found");
    return await db_1.sequelize.transaction(async (transaction) => {
        const pool = await db_1.models.stakingPool.findByPk(poolId, { transaction });
        if (!pool)
            throw new Error("Staking pool not found");
        const wallet = await db_1.models.wallet.findOne({
            where: {
                userId: user.id,
                currency: pool.currency,
                type: pool.type,
            },
            transaction,
        });
        if (!wallet)
            throw new Error("Wallet not found");
        if (wallet.balance < amount) {
            throw new Error("Insufficient balance");
        }
        const duration = await db_1.models.stakingDuration.findByPk(durationId, {
            transaction,
        });
        if (!duration)
            throw new Error("Staking duration not found");
        const newBalance = wallet.balance - amount;
        await wallet.update({ balance: newBalance }, { transaction });
        const releaseDate = new Date();
        releaseDate.setDate(releaseDate.getDate() + duration.duration);
        const newStake = await db_1.models.stakingLog.create({
            userId: user.id,
            poolId: poolId,
            durationId: durationId,
            amount,
            status: "ACTIVE",
        }, { transaction });
        const reward = (amount * duration.duration * duration.interestRate) / 100;
        await db_1.models.transaction.create({
            userId: user.id,
            walletId: wallet.id,
            type: "STAKING",
            amount,
            description: `Staked ${amount} ${pool.currency} for ${duration.duration} days at ${duration.interestRate}% interest`,
            status: "COMPLETED",
            referenceId: newStake.id,
            metadata: JSON.stringify({
                poolId: poolId,
                durationId: durationId,
                reward: reward.toString(),
            }),
        }, { transaction });
        // Send email notification
        try {
            await (0, utils_1.sendStakingInitiationEmail)(userPk, newStake, pool, reward.toString());
        }
        catch (error) {
            console.error("Failed to send email notification", error);
        }
        return {
            message: "Tokens staked successfully",
        };
    });
};
