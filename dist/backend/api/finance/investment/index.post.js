"use strict";
// /server/api/investment/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvestmentRecord = exports.metadata = void 0;
const emails_1 = require("@b/utils/emails");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../wallet/utils");
const date_1 = require("@b/utils/date");
exports.metadata = {
    summary: "Creates a new investment",
    description: "Initiates a new investment based on the specified plan and amount. This process involves updating the user's wallet balance and creating transaction records.",
    operationId: "createInvestment",
    tags: ["Finance", "Investment"],
    parameters: [],
    requestBody: {
        description: "Data required to create a new investment",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            description: "The type of investment plan",
                            example: "general",
                        },
                        planId: {
                            type: "string",
                            description: "The unique identifier of the investment plan",
                            example: "1",
                        },
                        amount: {
                            type: "number",
                            description: "Investment amount",
                            example: 1000.0,
                        },
                        durationId: {
                            type: "string",
                            description: "The unique identifier of the investment duration",
                            example: "1",
                        },
                    },
                    required: ["type", "planId", "durationId", "amount"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Investment"),
    requiresAuth: true,
};
/**
 * Named function that can be reused directly in tests or elsewhere.
 */
async function createInvestmentRecord(data) {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { type, planId, amount, durationId } = body;
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk) {
        throw new Error("User not found");
    }
    if (!type || typeof type !== "string") {
        throw new Error("Invalid investment type");
    }
    let model, planModel, durationModel, trxType, mailType;
    switch (type.toLowerCase()) {
        case "general":
            model = db_1.models.investment;
            planModel = db_1.models.investmentPlan;
            durationModel = db_1.models.investmentDuration;
            trxType = "INVESTMENT";
            mailType = "NewInvestmentCreated";
            break;
        case "forex":
            model = db_1.models.forexInvestment;
            planModel = db_1.models.forexPlan;
            durationModel = db_1.models.forexDuration;
            trxType = "FOREX_INVESTMENT";
            mailType = "NewForexInvestmentCreated";
            break;
        default:
            throw new Error("Invalid investment type");
    }
    const plan = await planModel.findByPk(planId);
    if (!plan) {
        throw new Error("Investment plan not found");
    }
    const duration = await durationModel.findByPk(durationId);
    if (!duration) {
        throw new Error("Investment duration not found");
    }
    const wallet = await (0, utils_1.getWallet)(user.id, plan.walletType, plan.currency);
    if (wallet.balance < amount) {
        throw new Error("Insufficient balance");
    }
    // Example: If plan.profitPercentage = 10, ROI = (10 / 100) * amount
    const roi = (plan.profitPercentage / 100) * amount;
    const newBalance = wallet.balance - amount;
    const newInvestment = await db_1.sequelize.transaction(async (transaction) => {
        // Subtract principal from wallet
        await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id }, transaction });
        let createdInvestment;
        try {
            createdInvestment = await model.create({
                userId: user.id,
                planId,
                durationId: duration.id,
                walletId: wallet.id,
                amount,
                profit: roi,
                status: "ACTIVE",
                endDate: (0, date_1.getEndDate)(duration.duration, duration.timeframe),
            }, { transaction });
        }
        catch (error) {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Already invested in this plan",
            });
        }
        // Example transaction log
        await db_1.models.transaction.create({
            userId: user.id,
            walletId: wallet.id,
            amount,
            description: `Investment in ${plan.name} plan for ${duration.duration} ${duration.timeframe}`,
            status: "COMPLETED",
            fee: 0,
            type: trxType,
            referenceId: createdInvestment.id,
        }, { transaction });
        return createdInvestment;
    });
    // Re-fetch the investment with related data after creation (for email)
    const investmentForEmail = await model.findByPk(newInvestment.id, {
        include: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: planModel,
                as: "plan",
            },
            {
                model: durationModel,
                as: "duration",
            },
        ],
    });
    if (investmentForEmail) {
        await (0, emails_1.sendInvestmentEmail)(userPk, plan, duration, investmentForEmail, mailType);
    }
    else {
        throw new Error("Failed to fetch the newly created investment for email.");
    }
    return { message: "Investment created successfully" };
}
exports.createInvestmentRecord = createInvestmentRecord;
/**
 * Default export for the route handler, if this file is used as an API endpoint.
 * Internally calls the named function above, so you can test it separately.
 */
async function handleCreateInvestment(data) {
    return createInvestmentRecord(data);
}
exports.default = handleCreateInvestment;
