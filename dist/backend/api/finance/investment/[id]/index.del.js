"use strict";
// /server/api/investment/cancel.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const emails_1 = require("@b/utils/emails");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../../wallet/utils");
exports.metadata = {
    summary: "Cancels an investment",
    description: "Allows a user to cancel an existing investment by its UUID. The operation reverses any financial transactions associated with the investment and updates the user’s wallet balance accordingly.",
    operationId: "cancelInvestment",
    tags: ["Finance", "Investment"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the investment to cancel",
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            name: "type",
            in: "query",
            description: "The type of investment to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Investment canceled successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Investment"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, params, query } = data;
    if (!user)
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { id } = params;
    const { type } = query;
    if (!type || typeof type !== "string") {
        throw new Error("Invalid investment type");
    }
    let investment, model, planModel, durationModel;
    switch (type.toLowerCase()) {
        case "general":
            model = db_1.models.investment;
            planModel = db_1.models.investmentPlan;
            durationModel = db_1.models.investmentDuration;
            break;
        case "forex":
            model = db_1.models.forexInvestment;
            planModel = db_1.models.forexPlan;
            durationModel = db_1.models.forexDuration;
            break;
    }
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk) {
        throw new Error("User not found");
    }
    await db_1.sequelize.transaction(async (transaction) => {
        investment = await model.findOne({
            where: { id },
            include: [
                {
                    model: planModel,
                    as: "plan",
                },
                {
                    model: db_1.models.user,
                    as: "user",
                    attributes: ["firstName", "lastName", "email", "avatar"],
                },
                {
                    model: durationModel,
                    as: "duration",
                },
            ],
        });
        if (!investment)
            throw new Error("Investment not found");
        const wallet = await (0, utils_1.getWallet)(user.id, investment.plan.walletType, investment.plan.currency);
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        // Check if the transaction exists
        const existingTransaction = await db_1.models.transaction.findOne({
            where: { referenceId: id },
        });
        // Update wallet balance
        await db_1.models.wallet.update({
            balance: db_1.sequelize.literal(`balance + ${investment.amount}`),
        }, {
            where: { id: wallet.id },
            transaction,
        });
        // Delete investment
        await investment.destroy({
            force: true,
            transaction,
        });
        // Delete associated transaction if it exists
        if (existingTransaction) {
            await existingTransaction.destroy({
                force: true,
                transaction,
            });
        }
    });
    try {
        await (0, emails_1.sendInvestmentEmail)(userPk, investment.plan, investment.duration, investment, "InvestmentCanceled");
    }
    catch (error) {
        console.error("Error sending investment email", error);
    }
};
