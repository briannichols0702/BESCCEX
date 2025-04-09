"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseStake = exports.processStakingLogs = void 0;
const db_1 = require("@b/db");
const date_fns_1 = require("date-fns");
const emails_1 = require("../emails");
const notifications_1 = require("../notifications");
const affiliate_1 = require("../affiliate");
const logger_1 = require("../logger");
async function processStakingLogs() {
    try {
        const stakingLogsToRelease = (await db_1.models.stakingLog.findAll({
            where: {
                status: "ACTIVE",
            },
            include: [
                {
                    model: db_1.models.stakingPool,
                    as: "pool",
                    attributes: ["name", "currency", "chain", "type"],
                },
                {
                    model: db_1.models.user,
                    as: "user",
                    attributes: ["id", "email", "firstName", "lastName"],
                },
                {
                    model: db_1.models.stakingDuration,
                    as: "duration",
                    attributes: ["duration", "interestRate"],
                },
            ],
        }));
        for (const log of stakingLogsToRelease) {
            if (!log.createdAt || !log.duration)
                continue;
            const endDate = (0, date_fns_1.addDays)(new Date(log.createdAt), log.duration.duration);
            if ((0, date_fns_1.isPast)(endDate)) {
                try {
                    const interest = (log.amount * log.duration.interestRate) / 100;
                    const releaseDate = new Date(); // Assuming release date is now
                    log.releaseDate = releaseDate; // Set the release date
                    await log.save(); // Save the updated log with the release date
                    await releaseStake(log.id);
                    await (0, emails_1.sendStakingRewardEmail)(log.user, log, log.pool, interest // Assuming this is the reward structure in your schema
                    );
                    await (0, notifications_1.handleNotification)({
                        userId: log.user.id,
                        title: "Staking Reward",
                        message: `You have received a staking reward of ${interest} ${log.pool.currency}`,
                        type: "ACTIVITY",
                    });
                    await (0, affiliate_1.processRewards)(log.user.id, log.amount, "STAKING_LOYALTY", log.pool.currency);
                }
                catch (error) {
                    (0, logger_1.logError)(`processStakingLogs`, error, __filename);
                }
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("processStakingLogs", error, __filename);
        throw error;
    }
}
exports.processStakingLogs = processStakingLogs;
async function releaseStake(stakeId) {
    try {
        await db_1.models.stakingLog.update({ status: "RELEASED" }, { where: { id: stakeId } });
    }
    catch (error) {
        (0, logger_1.logError)(`releaseStake`, error, __filename);
        throw error;
    }
}
exports.releaseStake = releaseStake;
