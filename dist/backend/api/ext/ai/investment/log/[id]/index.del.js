"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes an AI investment",
    description: "Deletes an existing AI trading investment for the currently authenticated user.",
    operationId: "deleteInvestment",
    tags: ["AI Trading"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Investment ID" },
        },
    ],
    responses: (0, query_1.deleteRecordResponses)("AI Investment"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk) {
        throw (0, error_1.createError)({ statusCode: 404, message: "User not found" });
    }
    const investment = await db_1.models.aiInvestment.findByPk(id);
    if (!investment) {
        throw (0, error_1.createError)({ statusCode: 404, message: "Investment not found" });
    }
    if (investment.userId !== user.id) {
        throw (0, error_1.createError)({ statusCode: 403, message: "Forbidden" });
    }
    await db_1.sequelize.transaction(async (t) => {
        const wallet = await db_1.models.wallet.findOne({
            where: {
                userId: user.id,
                currency: investment.symbol.split("/")[1],
                type: investment.type,
            },
            transaction: t,
        });
        if (!wallet) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Wallet not found" });
        }
        await db_1.models.aiInvestment.destroy({
            where: { id },
            force: true,
            transaction: t,
        });
        await wallet.update({ balance: wallet.balance + investment.amount }, { transaction: t });
        await db_1.models.transaction.destroy({
            where: { referenceId: id },
            force: true,
            transaction: t,
        });
    });
    return {
        message: "Investment cancelled successfully",
    };
};
