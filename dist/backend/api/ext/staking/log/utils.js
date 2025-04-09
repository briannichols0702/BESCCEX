"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePoolSchema = exports.baseStakeSchema = exports.sendStakingInitiationEmail = void 0;
const emails_1 = require("@b/utils/emails");
const schema_1 = require("@b/utils/schema");
async function sendStakingInitiationEmail(user, stake, pool, reward) {
    const stakeDate = new Date(stake.stake_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    const releaseDate = new Date(stake.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        TOKEN_NAME: pool.name,
        STAKE_AMOUNT: stake.amount.toString(),
        TOKEN_SYMBOL: pool.currency,
        STAKE_DATE: stakeDate,
        RELEASE_DATE: releaseDate,
        EXPECTED_REWARD: reward,
    };
    await emails_1.emailQueue.add({
        emailData,
        emailType: "StakingInitiationConfirmation",
    });
}
exports.sendStakingInitiationEmail = sendStakingInitiationEmail;
exports.baseStakeSchema = {
    id: (0, schema_1.baseStringSchema)("Stake ID"),
    amount: (0, schema_1.baseNumberSchema)("Staked amount"),
    interestRate: (0, schema_1.baseNumberSchema)("Interest rate"),
    status: (0, schema_1.baseStringSchema)("Stake status"),
    pool: {
        type: "object",
        properties: {
            name: (0, schema_1.baseStringSchema)("Pool name"),
            currency: (0, schema_1.baseStringSchema)("Currency"),
            chain: (0, schema_1.baseStringSchema)("Blockchain"),
            type: (0, schema_1.baseStringSchema)("Pool type"),
            durations: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        duration: (0, schema_1.baseNumberSchema)("Duration in days"),
                        interestRate: (0, schema_1.baseNumberSchema)("Interest rate"),
                    },
                },
                description: "Staking durations related to the pool",
            },
        },
    },
};
exports.basePoolSchema = {
    name: (0, schema_1.baseStringSchema)("Pool name"),
    currency: (0, schema_1.baseStringSchema)("Currency"),
    chain: (0, schema_1.baseStringSchema)("Blockchain"),
    type: (0, schema_1.baseStringSchema)("Pool type"),
    durations: {
        type: "array",
        items: {
            type: "object",
            properties: {
                duration: (0, schema_1.baseNumberSchema)("Duration in days"),
                interestRate: (0, schema_1.baseNumberSchema)("Interest rate"),
            },
        },
        description: "Staking durations related to the pool",
    },
};
