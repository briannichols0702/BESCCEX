"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInvestments = exports.deleteInvestments = exports.findInvestmentById = exports.baseUserSchema = exports.baseInvestmentPlanSchema = exports.baseInvestmentSchema = void 0;
const passwords_1 = require("@b/utils/passwords");
const db_1 = require("@b/db");
const schema_1 = require("@b/utils/schema");
exports.baseInvestmentSchema = {
    id: (0, schema_1.baseStringSchema)("ID of the investment"),
    amount: (0, schema_1.baseNumberSchema)("Amount of the investment"),
    roi: (0, schema_1.baseNumberSchema)("Return on investment (ROI) of the investment"),
    duration: (0, schema_1.baseIntegerSchema)("Duration of the investment in days"),
    status: (0, schema_1.baseStringSchema)("Status of the investment"),
};
exports.baseInvestmentPlanSchema = {
    id: (0, schema_1.baseStringSchema)("ID of the investment plan"),
    name: (0, schema_1.baseStringSchema)("Name of the investment plan"),
    title: (0, schema_1.baseStringSchema)("Title of the investment plan"),
    image: (0, schema_1.baseStringSchema)("Image of the investment plan"),
    description: (0, schema_1.baseStringSchema)("Description of the investment plan"),
    currency: (0, schema_1.baseStringSchema)("Currency of the investment plan"),
    minAmount: (0, schema_1.baseNumberSchema)("Minimum amount required for the investment plan"),
    maxAmount: (0, schema_1.baseNumberSchema)("Maximum amount allowed for the investment plan"),
    roi: (0, schema_1.baseNumberSchema)("Return on investment (ROI) of the investment plan"),
    duration: (0, schema_1.baseIntegerSchema)("Duration of the investment plan in days"),
    status: (0, schema_1.baseBooleanSchema)("Status of the investment plan"),
};
exports.baseUserSchema = {
    id: (0, schema_1.baseStringSchema)("ID of the user"),
    firstName: (0, schema_1.baseStringSchema)("First name of the user"),
    lastName: (0, schema_1.baseStringSchema)("Last name of the user"),
    avatar: (0, schema_1.baseStringSchema)("Avatar of the user"),
};
// Constants for Error Messages
const INVESTMENT_NOT_FOUND = "Investment not found";
async function findInvestmentById(id) {
    const investment = await db_1.models.investment.findOne({
        where: { id },
        include: [
            {
                model: db_1.models.investmentPlan,
                as: "plan",
            },
            {
                model: db_1.models.wallet,
                as: "wallet",
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
    if (!investment)
        throw new Error(INVESTMENT_NOT_FOUND);
    return investment.get({ plain: true });
}
exports.findInvestmentById = findInvestmentById;
async function deleteInvestments(ids) {
    await db_1.models.investment.destroy({
        where: {
            id: ids,
        },
    });
}
exports.deleteInvestments = deleteInvestments;
async function checkInvestments() {
    const investments = await db_1.models.investment.findAll({
        where: { status: "ACTIVE" },
        include: [
            {
                model: db_1.models.investmentPlan,
                as: "plan",
            },
            {
                model: db_1.models.investmentDuration,
                as: "duration",
            },
        ],
    });
    for (const investment of investments) {
        if (!investment.createdAt)
            continue;
        let duration;
        switch (investment.duration.timeframe) {
            case "HOUR":
                duration = investment.duration.duration * 60 * 60 * 1000;
                break;
            case "DAY":
                duration = investment.duration.duration * 24 * 60 * 60 * 1000;
                break;
            case "WEEK":
                duration = investment.duration.duration * 7 * 24 * 60 * 60 * 1000;
                break;
            case "MONTH":
                duration = investment.duration.duration * 30 * 24 * 60 * 60 * 1000;
                break;
        }
        const endDate = new Date(investment.createdAt.getTime() + duration);
        const currentDate = new Date();
        if (currentDate.getTime() < endDate.getTime())
            continue;
        // Process each investment within its own transaction
        await db_1.sequelize.transaction(async (transaction) => {
            const wallet = await db_1.models.wallet.findOne({
                where: {
                    userId: investment.userId,
                    currency: investment.plan.currency,
                    type: investment.plan.walletType,
                },
                transaction,
            });
            if (!wallet)
                throw new Error("Wallet not found");
            if (investment.profit) {
                const profit = investment.amount * (investment.profit / 100);
                const roi = investment.amount + profit;
                const balance = wallet.balance + roi;
                // Update wallet balance
                await wallet.update({ balance }, { transaction });
                // Create a transaction record for ROI
                await db_1.models.transaction.create({
                    userId: investment.userId,
                    walletId: wallet.id,
                    amount: roi,
                    referenceId: (0, passwords_1.makeUuid)(),
                    description: `Investment ROI: Plan "${investment.plan.title}" | Duration: ${investment.duration.duration} ${investment.duration.timeframe}`,
                    status: "COMPLETED",
                    fee: 0,
                    type: "INVESTMENT_ROI",
                }, { transaction });
                // Mark investment as COMPLETED
                await investment.update({ status: "COMPLETED" }, { transaction });
            }
        });
    }
}
exports.checkInvestments = checkInvestments;
