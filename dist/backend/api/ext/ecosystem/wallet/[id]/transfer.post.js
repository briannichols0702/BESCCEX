"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const wallet_1 = require("@b/utils/eco/wallet");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Transfers funds between user wallets",
    description: "Allows a user to transfer funds to another user's wallet.",
    operationId: "transferFunds",
    tags: ["Wallet", "Transfer"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "string",
                description: "UUID of the recipient's wallet or user",
            },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        amount: { type: "number", description: "Amount to transfer" },
                        currency: {
                            type: "string",
                            description: "Currency for the transfer",
                        },
                    },
                    required: ["amount", "currency"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Transfer completed successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message indicating the transfer has been processed.",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Wallet"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params, body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    try {
        const { id } = params;
        const { currency, amount } = body;
        const senderWallet = await (0, wallet_1.getWalletByUserIdAndCurrency)(user.id, currency);
        if (!senderWallet) {
            throw (0, error_1.createError)({ statusCode: 404, message: "User wallet not found" });
        }
        const recipientAccount = await db_1.models.user.findOne({
            where: { id },
        });
        if (!recipientAccount) {
            throw (0, error_1.createError)({
                statusCode: 404,
                message: "Recipient user not found",
            });
        }
        let recipientWallet = (await (0, wallet_1.getWalletByUserIdAndCurrency)(recipientAccount.id, currency));
        if (!recipientWallet) {
            recipientWallet = await (0, wallet_1.storeWallet)(recipientAccount, currency);
        }
        if (senderWallet.balance < amount) {
            throw (0, error_1.createError)({ statusCode: 400, message: "Insufficient funds" });
        }
        await db_1.sequelize.transaction(async (transaction) => {
            await db_1.models.wallet.update({
                balance: senderWallet.balance - amount,
            }, {
                where: { id: senderWallet.id },
                transaction,
            });
            await db_1.models.wallet.update({
                balance: recipientWallet.balance + amount,
            }, {
                where: { id: recipientWallet.id },
                transaction,
            });
            await db_1.models.transaction.create({
                userId: user.id,
                walletId: senderWallet.id,
                type: "OUTGOING_TRANSFER",
                status: "COMPLETED",
                amount,
                description: `Transferred out ${amount} ${currency}`,
                fee: 0,
            }, { transaction });
            await db_1.models.transaction.create({
                userId: recipientAccount.id,
                walletId: recipientWallet.id,
                type: "INCOMING_TRANSFER",
                status: "COMPLETED",
                amount,
                description: `Transferred in ${amount} ${currency}`,
                fee: 0,
            }, { transaction });
        });
        return { message: "Transfer successful" };
    }
    catch (error) {
        console.log(`Failed to transfer: ${error.message}`);
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to transfer: ${error.message}`,
        });
    }
};
