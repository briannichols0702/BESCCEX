"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const emails_1 = require("@b/utils/emails");
const error_1 = require("@b/utils/error");
const notifications_1 = require("@b/utils/notifications");
const passwords_1 = require("@b/utils/passwords");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new investment",
    description: "Creates a new AI trading investment for the currently authenticated user based on the provided details.",
    operationId: "createInvestment",
    tags: ["AI Trading"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        currency: {
                            type: "string",
                            description: "Currency of the investment",
                        },
                        pair: { type: "string", description: "Trading pair" },
                        planId: {
                            type: "string",
                            description: "Plan ID to be used for the investment",
                        },
                        durationId: {
                            type: "string",
                            description: "Duration ID for the investment",
                        },
                        amount: { type: "number", description: "Amount to be invested" },
                        type: { type: "string", description: "Type of wallet" },
                    },
                    required: ["planId", "durationId", "amount", "currency", "pair"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("AI Investment"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk) {
        throw (0, error_1.createError)({ statusCode: 404, message: "User not found" });
    }
    const { planId, durationId, amount, currency, pair, type } = body;
    const plan = await db_1.models.aiInvestmentPlan.findByPk(planId);
    if (!plan) {
        throw (0, error_1.createError)({ statusCode: 404, message: "Plan not found" });
    }
    if (!plan.status) {
        throw (0, error_1.createError)({ statusCode: 400, message: "Plan is not active" });
    }
    const duration = await db_1.models.aiInvestmentDuration.findByPk(durationId);
    if (!duration) {
        throw (0, error_1.createError)({ statusCode: 404, message: "Duration not found" });
    }
    if (plan.minAmount > amount || plan.maxAmount < amount) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: `Amount must be between ${plan.minAmount} and ${plan.maxAmount}`,
        });
    }
    const investment = await db_1.sequelize.transaction(async (t) => {
        const wallet = await db_1.models.wallet.findOne({
            where: {
                userId: user.id,
                currency: pair,
                type,
            },
            transaction: t,
        });
        if (!wallet) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Wallet not found" });
        }
        if (wallet.balance < amount) {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Insufficient funds",
            });
        }
        const investmentId = (0, passwords_1.makeUuid)();
        const investment = await db_1.models.aiInvestment.create({
            id: investmentId,
            userId: user.id,
            planId,
            durationId,
            symbol: `${currency}/${pair}`,
            amount,
            status: "ACTIVE",
            type: type || "SPOT",
        }, {
            transaction: t,
        });
        await wallet.update({ balance: wallet.balance - amount }, { transaction: t });
        await db_1.models.transaction.create({
            userId: user.id,
            walletId: wallet.id,
            amount: amount,
            description: `Investment: Plan "${plan.title}" | Duration: ${duration.duration} ${duration.timeframe}`,
            status: "COMPLETED",
            type: "AI_INVESTMENT",
            referenceId: investmentId,
        }, { transaction: t });
        return investment;
    });
    try {
        await (0, emails_1.sendAiInvestmentEmail)(userPk, plan, duration, investment, "NewAiInvestmentCreated");
        await (0, notifications_1.handleNotification)({
            userId: user.id,
            title: "AI Investment Created",
            message: `Your AI investment for ${investment.symbol} has been created successfully`,
            type: "ACTIVITY",
        });
    }
    catch (error) {
        console.error("Failed to send email", error);
    }
    return {
        message: "Investment created successfully",
    };
};
