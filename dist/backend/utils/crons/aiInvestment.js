"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAiInvestment = exports.getActiveInvestments = exports.processAiInvestments = void 0;
const db_1 = require("@b/db");
const logger_1 = require("../logger");
const date_fns_1 = require("date-fns");
const index_get_1 = require("@b/api/finance/transaction/[id]/index.get");
const utils_1 = require("@b/api/finance/wallet/utils");
const emails_1 = require("../emails");
const notifications_1 = require("../notifications");
const affiliate_1 = require("../affiliate");
async function processAiInvestments() {
    try {
        const activeInvestments = await getActiveInvestments();
        for (const investment of activeInvestments) {
            try {
                await processAiInvestment(investment);
            }
            catch (error) {
                (0, logger_1.logError)(`processAiInvestments - investment ${investment.id}`, error, __filename);
                continue;
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("processAiInvestments", error, __filename);
        throw error;
    }
}
exports.processAiInvestments = processAiInvestments;
async function getActiveInvestments() {
    try {
        return await db_1.models.aiInvestment.findAll({
            where: {
                status: "ACTIVE",
            },
            include: [
                {
                    model: db_1.models.aiInvestmentPlan,
                    as: "plan",
                    attributes: [
                        "id",
                        "name",
                        "title",
                        "description",
                        "defaultProfit",
                        "defaultResult",
                    ],
                },
                {
                    model: db_1.models.aiInvestmentDuration,
                    as: "duration",
                    attributes: ["id", "duration", "timeframe"],
                },
            ],
            order: [
                ["status", "ASC"], // 'ASC' for ascending or 'DESC' for descending
                ["createdAt", "ASC"], // 'ASC' for oldest first, 'DESC' for newest first
            ],
        });
    }
    catch (error) {
        (0, logger_1.logError)("getActiveInvestments", error, __filename);
        throw error;
    }
}
exports.getActiveInvestments = getActiveInvestments;
async function processAiInvestment(investment) {
    const { id, duration, createdAt, amount, profit, result, plan, status } = investment;
    if (status === "COMPLETED") {
        return null;
    }
    try {
        const user = await db_1.models.user.findByPk(investment.userId);
        if (!user) {
            (0, logger_1.logError)(`processAiInvestment`, new Error("User not found"), __filename);
            return null;
        }
        const roi = profit || plan.defaultProfit;
        const investmentResult = result || plan.defaultResult;
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
        if ((0, date_fns_1.isPast)(endDate)) {
            let updatedInvestment, wallet;
            try {
                const transaction = await (0, index_get_1.getTransactionByRefId)(id);
                if (!transaction) {
                    (0, logger_1.logError)(`processAiInvestment`, new Error("Transaction not found"), __filename);
                    await db_1.models.aiInvestment.destroy({
                        where: { id },
                    });
                    return null;
                }
                wallet = await (0, utils_1.getWalletById)(transaction.walletId);
                if (!wallet)
                    throw new Error("Wallet not found");
                let newBalance = wallet.balance;
                if (investmentResult === "WIN") {
                    newBalance += amount + roi;
                }
                else if (investmentResult === "LOSS") {
                    newBalance += amount - roi;
                }
                else {
                    newBalance += amount;
                }
                // Update Wallet
                updatedInvestment = await db_1.sequelize.transaction(async (transaction) => {
                    await db_1.models.wallet.update({
                        balance: newBalance,
                    }, {
                        where: { id: wallet.id },
                        transaction,
                    });
                    await db_1.models.transaction.create({
                        userId: wallet.userId,
                        walletId: wallet.id,
                        amount: investmentResult === "WIN"
                            ? roi
                            : investmentResult === "LOSS"
                                ? -roi
                                : 0,
                        description: `Investment ROI: Plan "${investment.plan.title}" | Duration: ${investment.duration.duration} ${investment.duration.timeframe}`,
                        status: "COMPLETED",
                        type: "AI_INVESTMENT_ROI",
                    }, { transaction });
                    await db_1.models.aiInvestment.update({
                        status: "COMPLETED",
                        result: investmentResult,
                        profit: roi,
                    }, {
                        where: { id },
                        transaction,
                    });
                    return await db_1.models.aiInvestment.findByPk(id, {
                        include: [
                            { model: db_1.models.aiInvestmentPlan, as: "plan" },
                            { model: db_1.models.aiInvestmentDuration, as: "duration" },
                        ],
                        transaction,
                    });
                });
            }
            catch (error) {
                (0, logger_1.logError)(`processAiInvestment`, error, __filename);
                return null;
            }
            if (updatedInvestment) {
                try {
                    if (!updatedInvestment)
                        throw new Error("Investment not found");
                    await (0, emails_1.sendAiInvestmentEmail)(user, plan, duration, updatedInvestment, "AiInvestmentCompleted");
                    await (0, notifications_1.handleNotification)({
                        userId: user.id,
                        title: "AI Investment Completed",
                        message: `Your AI investment of ${amount} ${wallet.currency} has been completed with a status of ${investmentResult}`,
                        type: "ACTIVITY",
                    });
                }
                catch (error) {
                    (0, logger_1.logError)(`processAiInvestment`, error, __filename);
                }
                try {
                    await (0, affiliate_1.processRewards)(user.id, amount, "AI_INVESTMENT", wallet === null || wallet === void 0 ? void 0 : wallet.currency);
                }
                catch (error) {
                    (0, logger_1.logError)(`processAiInvestment`, error, __filename);
                }
            }
            return updatedInvestment;
        }
    }
    catch (error) {
        (0, logger_1.logError)(`processAiInvestment`, error, __filename);
        throw error;
    }
}
exports.processAiInvestment = processAiInvestment;
