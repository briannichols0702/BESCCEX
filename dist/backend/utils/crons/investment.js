"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processGeneralInvestment = exports.getActiveGeneralInvestments = exports.processGeneralInvestments = void 0;
const db_1 = require("@b/db");
const logger_1 = require("../logger");
const date_fns_1 = require("date-fns");
const emails_1 = require("../emails");
const notifications_1 = require("../notifications");
const affiliate_1 = require("../affiliate");
async function processGeneralInvestments() {
    try {
        const activeInvestments = await getActiveGeneralInvestments();
        for (const investment of activeInvestments) {
            try {
                await processGeneralInvestment(investment);
            }
            catch (error) {
                (0, logger_1.logError)(`processGeneralInvestments - Error processing General investment ${investment.id}`, error, __filename);
                continue;
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("processGeneralInvestments", error, __filename);
        throw error;
    }
}
exports.processGeneralInvestments = processGeneralInvestments;
async function getActiveGeneralInvestments() {
    try {
        return await db_1.models.investment.findAll({
            where: {
                status: "ACTIVE",
            },
            include: [
                {
                    model: db_1.models.investmentPlan,
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
                    model: db_1.models.investmentDuration,
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
        (0, logger_1.logError)("getActiveGeneralInvestments", error, __filename);
        throw error;
    }
}
exports.getActiveGeneralInvestments = getActiveGeneralInvestments;
async function processGeneralInvestment(investment) {
    const { id, duration, createdAt, amount, profit, result, plan, userId } = investment;
    // Skip if already completed
    if (investment.status === "COMPLETED") {
        return null;
    }
    try {
        const user = await db_1.models.user.findByPk(userId);
        if (!user) {
            (0, logger_1.logError)(`processGeneralInvestment`, new Error("User not found"), __filename);
            return null;
        }
        const roi = profit || plan.defaultProfit;
        const investmentResult = result || plan.defaultResult;
        // Calculate end date
        let endDate;
        switch (duration.timeframe) {
            case "HOUR":
                endDate = (0, date_fns_1.addHours)(new Date(createdAt), duration.duration);
                break;
            case "DAY":
                endDate = (0, date_fns_1.addDays)(new Date(createdAt), duration.duration);
                break;
            case "WEEK":
                endDate = (0, date_fns_1.addDays)(new Date(createdAt), duration.duration * 7);
                break;
            case "MONTH":
                endDate = (0, date_fns_1.addDays)(new Date(createdAt), duration.duration * 30);
                break;
            default:
                endDate = (0, date_fns_1.addHours)(new Date(createdAt), duration.duration);
                break;
        }
        // If it's past the end date, complete the investment
        if ((0, date_fns_1.isPast)(endDate)) {
            let updatedInvestment;
            try {
                // Fetch the wallet
                const wallet = await db_1.models.wallet.findOne({
                    where: {
                        userId: userId,
                        currency: plan.currency,
                        type: plan.walletType,
                    },
                });
                if (!wallet)
                    throw new Error("Wallet not found");
                // FIX: Add principal + ROI on WIN, do nothing on LOSS, principal only on DRAW
                const newBalance = getNewBalance(wallet.balance, amount, roi, investmentResult);
                // Update wallet & investment in a transaction
                updatedInvestment = await db_1.sequelize.transaction(async (transaction) => {
                    await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id }, transaction });
                    await db_1.models.investment.update({
                        status: "COMPLETED",
                        result: investmentResult,
                        profit: roi,
                    }, {
                        where: { id },
                        transaction,
                    });
                    return await db_1.models.investment.findByPk(id, {
                        include: [
                            { model: db_1.models.investmentPlan, as: "plan" },
                            { model: db_1.models.investmentDuration, as: "duration" },
                        ],
                        transaction,
                    });
                });
            }
            catch (error) {
                (0, logger_1.logError)(`processGeneralInvestment`, error, __filename);
                return null;
            }
            if (updatedInvestment) {
                // Send email, notify user, affiliate rewards
                try {
                    await (0, emails_1.sendInvestmentEmail)(user, plan, duration, updatedInvestment, "InvestmentCompleted");
                    await (0, notifications_1.handleNotification)({
                        userId: user.id,
                        title: "General Investment Completed",
                        message: `Your General investment of ${amount} has been completed with a status of ${investmentResult}`,
                        type: "ACTIVITY",
                    });
                }
                catch (error) {
                    (0, logger_1.logError)(`processGeneralInvestment`, error, __filename);
                }
                // Rewards
                try {
                    await (0, affiliate_1.processRewards)(user.id, amount, "GENERAL_INVESTMENT", plan.currency);
                }
                catch (error) {
                    (0, logger_1.logError)(`processGeneralInvestment`, error, __filename);
                }
            }
            return updatedInvestment;
        }
    }
    catch (error) {
        (0, logger_1.logError)(`processGeneralInvestment`, error, __filename);
        throw error;
    }
    return null;
}
exports.processGeneralInvestment = processGeneralInvestment;
// Helper function to fix principal + ROI logic
function getNewBalance(currentBalance, amount, roi, investmentResult) {
    switch (investmentResult) {
        case "WIN":
            // Return principal + profit
            return currentBalance + amount + roi;
        case "LOSS":
            // Already subtracted the principal at creation; do nothing
            return currentBalance;
        case "DRAW":
            // Return principal only
            return currentBalance + amount;
        default:
            return currentBalance;
    }
}
