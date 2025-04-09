"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Deposits funds to a P2P offer",
    description: "Deposits funds to a specified P2P offer.",
    operationId: "depositToOffer",
    tags: ["P2P", "Offers"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the offer to deposit",
            required: true,
            schema: {
                type: "string",
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
                        amount: {
                            type: "number",
                            description: "Amount to deposit",
                        },
                    },
                    required: ["amount"],
                },
            },
        },
    },
    responses: {
        201: {
            description: "Funds deposited successfully",
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
        401: {
            description: "Unauthorized, user must be authenticated",
        },
        500: {
            description: "Internal server error",
        },
    },
};
exports.default = async (data) => {
    const { body, user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    await db_1.sequelize.transaction(async (transaction) => {
        const offer = await db_1.models.p2pOffer.findByPk(id, { transaction });
        if (!offer) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Offer not found" });
        }
        if (offer.status === "CANCELLED") {
            throw (0, error_1.createError)({ statusCode: 400, message: "Offer is cancelled" });
        }
        const wallet = await db_1.models.wallet.findOne({
            where: {
                userId: user.id,
                type: offer.walletType,
                currency: offer.currency,
            },
            transaction,
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        if (wallet.balance < body.amount) {
            throw new Error("Insufficient funds");
        }
        const balance = wallet.balance - body.amount;
        await wallet.update({
            balance,
        }, {
            transaction,
        });
        await offer.update({
            amount: offer.amount + body.amount,
            status: "ACTIVE",
        }, {
            transaction,
        });
        // Log the transaction
        await db_1.models.transaction.create({
            userId: user.id,
            walletId: wallet.id,
            type: "P2P_OFFER_TRANSFER",
            status: "COMPLETED",
            amount: body.amount,
            description: `P2P offer created: ${offer.id}`,
        }, { transaction });
    });
    return {
        message: "Funds deposited successfully",
    };
};
