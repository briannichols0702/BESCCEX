"use strict";
// /server/api/wallets/fiat/customDeposit.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Performs a custom fiat deposit transaction",
    description: "Initiates a custom fiat deposit transaction for the currently authenticated user",
    operationId: "createCustomFiatDeposit",
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
                            description: "Deposit method ID",
                        },
                        amount: {
                            type: "number",
                            description: "Amount to deposit",
                        },
                        currency: {
                            type: "string",
                            description: "Currency to deposit",
                        },
                        customFields: {
                            type: "object",
                            description: "Custom data for the deposit",
                        },
                    },
                    required: ["methodId", "amount", "currency", "customFields"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Custom deposit transaction initiated successfully",
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
        404: (0, query_1.notFoundMetadataResponse)("Deposit Method"),
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
    let wallet = await db_1.models.wallet.findOne({
        where: { userId: user.id, currency: currency, type: "FIAT" },
    });
    if (!wallet) {
        wallet = await db_1.models.wallet.create({
            userId: user.id,
            currency: currency,
            type: "FIAT",
        });
    }
    const method = await db_1.models.depositMethod.findByPk(methodId);
    if (!method) {
        throw new Error("Deposit method not found");
    }
    const currencyData = await db_1.models.currency.findOne({
        where: { id: wallet.currency },
    });
    if (!currencyData) {
        throw new Error("Currency not found");
    }
    const parsedAmount = parseFloat(amount);
    const fixedFee = method.fixedFee || 0;
    const percentageFee = method.percentageFee || 0;
    const taxAmount = parseFloat(Math.max((parsedAmount * percentageFee) / 100 + fixedFee, 0).toFixed(2));
    // Start a transaction to create the deposit and admin profit records
    const transaction = await db_1.sequelize.transaction(async (t) => {
        // Create the main transaction record for the deposit
        const depositTransaction = await db_1.models.transaction.create({
            userId: user.id,
            walletId: wallet.id,
            type: "DEPOSIT",
            amount: parsedAmount,
            fee: taxAmount,
            status: "PENDING",
            metadata: JSON.stringify({
                method: method.title,
                ...customFields,
            }),
            description: `Deposit ${parsedAmount} ${wallet.currency} by ${method.title}`,
        }, { transaction: t });
        // **Admin Profit Recording:**
        if (taxAmount > 0) {
            await db_1.models.adminProfit.create({
                amount: taxAmount,
                currency: wallet.currency,
                type: "DEPOSIT",
                transactionId: depositTransaction.id,
                description: `Admin profit from deposit fee of ${taxAmount} ${wallet.currency} by ${method.title} for user (${user.id})`,
            }, { transaction: t });
        }
        return depositTransaction;
    });
    return {
        transaction,
        currency: wallet.currency,
        method: method.title,
    };
};
