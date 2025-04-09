"use strict";
// backend/utils/crons/forex.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.processForexInvestment = exports.getActiveForexInvestments = exports.processForexInvestments = void 0;
const db_1 = require("@b/db");
const logger_1 = require("../logger");
const date_fns_1 = require("date-fns");
const emails_1 = require("../emails");
const notifications_1 = require("../notifications");
const affiliate_1 = require("../affiliate");
async function processForexInvestments() {
    try {
        const activeInvestments = await getActiveForexInvestments();
        for (const investment of activeInvestments) {
            try {
                await processForexInvestment(investment);
            }
            catch (error) {
                (0, logger_1.logError)(`processForexInvestments - Error processing Forex investment ${investment.id}`, error, __filename);
                // keep going with the next investment
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("processForexInvestments", error, __filename);
        throw error;
    }
}
exports.processForexInvestments = processForexInvestments;
async function getActiveForexInvestments() {
    try {
        return await db_1.models.forexInvestment.findAll({
            where: {
                status: "ACTIVE",
            },
            include: [
                {
                    model: db_1.models.forexPlan,
                    as: "plan",
                    attributes: [
                        "id",
                        "name",
                        "title",
                        "description",
                        "defaultProfit",
                        "defaultResult",
                        "currency",
                        "walletType",
                    ],
                },
                {
                    model: db_1.models.forexDuration,
                    as: "duration",
                    attributes: ["id", "duration", "timeframe"],
                },
            ],
            order: [
                ["status", "ASC"],
                ["createdAt", "ASC"],
            ],
        });
    }
    catch (error) {
        (0, logger_1.logError)("getActiveForexInvestments", error, __filename);
        throw error;
    }
}
exports.getActiveForexInvestments = getActiveForexInvestments;
async function processForexInvestment(investment) {
    try {
        if (investment.status === "COMPLETED") {
            return null;
        }
        const user = await fetchUser(investment.userId);
        if (!user)
            return null;
        const roi = calculateRoi(investment);
        const investmentResult = determineInvestmentResult(investment);
        // Check if we are past the investment's endDate
        if (shouldProcessInvestment(investment)) {
            // Now use a callback-style transaction
            const updatedInvestment = await db_1.sequelize.transaction(async (transaction) => {
                const wallet = await fetchWallet(user.id, investment.plan.currency, investment.plan.walletType, transaction);
                if (!wallet)
                    return null;
                // Principal + ROI on WIN, principal only on DRAW, no returns on LOSS
                const newBalance = calculateNewBalance(wallet.balance, investment.amount, roi, investmentResult);
                // Update the wallet
                await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id }, transaction });
                // Mark the investment as completed
                await db_1.models.forexInvestment.update({
                    status: "COMPLETED",
                    result: investmentResult,
                    profit: roi,
                }, {
                    where: { id: investment.id },
                    transaction,
                });
                // Return the updated record (with plan/duration relationships)
                return await db_1.models.forexInvestment.findByPk(investment.id, {
                    include: [
                        { model: db_1.models.forexPlan, as: "plan" },
                        { model: db_1.models.forexDuration, as: "duration" },
                    ],
                    transaction,
                });
            });
            if (updatedInvestment) {
                // Post-process actions (emails, notifications, affiliate, etc.)
                await postProcessInvestment(user, investment, updatedInvestment);
            }
            return updatedInvestment;
        }
        return null;
    }
    catch (error) {
        (0, logger_1.logError)(`processForexInvestment - General`, error, __filename);
        throw error;
    }
}
exports.processForexInvestment = processForexInvestment;
/** Utility functions remain the same: */
function calculateRoi(investment) {
    return investment.profit || investment.plan.defaultProfit;
}
function determineInvestmentResult(investment) {
    return investment.result || investment.plan.defaultResult;
}
function shouldProcessInvestment(investment) {
    const endDate = calculateEndDate(investment);
    return (0, date_fns_1.isPast)(endDate);
}
function calculateEndDate(investment) {
    let endDate;
    const createdAt = new Date(investment.createdAt);
    switch (investment.duration.timeframe) {
        case "HOUR":
            endDate = (0, date_fns_1.addHours)(createdAt, investment.duration.duration);
            break;
        case "DAY":
            endDate = (0, date_fns_1.addDays)(createdAt, investment.duration.duration);
            break;
        case "WEEK":
            endDate = (0, date_fns_1.addDays)(createdAt, investment.duration.duration * 7);
            break;
        case "MONTH":
            endDate = (0, date_fns_1.addDays)(createdAt, investment.duration.duration * 30);
            break;
        default:
            endDate = (0, date_fns_1.addHours)(createdAt, investment.duration.duration);
            break;
    }
    return endDate;
}
async function fetchUser(userId) {
    try {
        const user = await db_1.models.user.findByPk(userId);
        if (!user) {
            (0, logger_1.logError)(`fetchUser`, new Error(`User not found: ${userId}`), __filename);
            return null;
        }
        return user;
    }
    catch (error) {
        (0, logger_1.logError)(`fetchUser`, error, __filename);
        throw error;
    }
}
async function fetchWallet(userId, currency, walletType, transaction) {
    try {
        const wallet = await db_1.models.wallet.findOne({
            where: { userId, currency, type: walletType },
            transaction,
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        return wallet;
    }
    catch (error) {
        (0, logger_1.logError)(`fetchWallet`, error, __filename);
        throw error;
    }
}
function calculateNewBalance(balance, amount, roi, result) {
    switch (result) {
        case "WIN":
            // principal + profit
            return balance + amount + roi;
        case "DRAW":
            // principal only
            return balance + amount;
        case "LOSS":
            // nothing returned
            return balance;
        default:
            throw new Error(`Unexpected result: ${result}`);
    }
}
async function postProcessInvestment(user, originalInvestment, updated) {
    try {
        await (0, emails_1.sendInvestmentEmail)(user, updated.plan, updated.duration, updated, "ForexInvestmentCompleted");
        await (0, notifications_1.handleNotification)({
            userId: user.id,
            title: "Forex Investment Completed",
            message: `Your Forex investment of ${updated.amount} ${updated.plan.currency} is now ${updated.result}.`,
            type: "ACTIVITY",
        });
        await (0, affiliate_1.processRewards)(user.id, originalInvestment.amount, "FOREX_INVESTMENT", updated.plan.currency);
    }
    catch (error) {
        (0, logger_1.logError)(`postProcessInvestment`, error, __filename);
    }
}
