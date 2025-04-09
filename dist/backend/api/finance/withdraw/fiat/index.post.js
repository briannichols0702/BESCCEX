"use strict";
// /server/api/wallets/fiat/customWithdraw.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Performs a custom fiat withdraw transaction",
    description: "Initiates a custom fiat withdraw transaction for the currently authenticated user",
    operationId: "createCustomFiatWithdraw",
    tags: ["Wallets"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        methodId: {
                            type: "string",
                            description: "Withdraw method ID",
                        },
                        amount: {
                            type: "number",
                            description: "Amount to withdraw",
                        },
                        currency: {
                            type: "string",
                            description: "Currency to withdraw",
                        },
                        customFields: {
                            type: "object",
                            description: "Custom data for the withdraw",
                        },
                    },
                    required: ["methodId", "amount", "currency", "customFields"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Custom withdraw transaction initiated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Withdraw Method"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { methodId, amount, currency, customFields } = body;
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk)
        throw (0, error_1.createError)({ statusCode: 404, message: "User not found" });
    const wallet = await db_1.models.wallet.findOne({
        where: { userId: user.id, currency: currency, type: "FIAT" },
    });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    const method = await db_1.models.withdrawMethod.findByPk(methodId);
    if (!method) {
        throw new Error("Withdraw method not found");
    }
    const currencyData = await db_1.models.currency.findOne({
        where: { id: wallet.currency },
    });
    if (!currencyData) {
        throw new Error("Currency not found");
    }
    const parsedAmount = Math.abs(parseFloat(amount));
    const fixedFee = method.fixedFee || 0;
    const percentageFee = method.percentageFee || 0;
    const taxAmount = parseFloat(Math.max((parsedAmount * percentageFee) / 100 + fixedFee, 0).toFixed(2));
    if (wallet.balance < parsedAmount + taxAmount) {
        throw new Error("Insufficient funds");
    }
    const transaction = await db_1.sequelize.transaction(async (t) => {
        wallet.balance -= parsedAmount + taxAmount;
        await wallet.save({ transaction: t });
        const trx = await db_1.models.transaction.create({
            userId: user.id,
            walletId: wallet.id,
            type: "WITHDRAW",
            amount: parsedAmount,
            fee: taxAmount,
            status: "PENDING",
            metadata: JSON.stringify({
                method: method.title,
                ...customFields,
            }),
            description: `Withdrawal of ${parsedAmount} ${wallet.currency} by ${method.title}`,
        }, { transaction: t });
        await db_1.models.adminProfit.create({
            amount: taxAmount,
            currency: wallet.currency,
            type: "WITHDRAW",
            transactionId: trx.id,
            description: `User (${user.id}) withdrawal fee of ${taxAmount} ${wallet.currency} by ${method.title}`,
        }, { transaction: t });
        return trx;
    });
    return {
        transaction,
        currency: wallet.currency,
        method: method.title,
        balance: wallet.balance,
    };
};
