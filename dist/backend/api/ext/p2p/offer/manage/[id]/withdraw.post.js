"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Withdraws an amount from an existing P2P offer",
    description: "Allows a user to withdraw a specified amount from an active P2P trading offer.",
    operationId: "withdrawFromUserOffer",
    tags: ["P2P", "Offers"],
    requiresAuth: true,
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the offer to withdraw from",
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
                            description: "Amount to withdraw",
                        },
                    },
                    required: ["amount"],
                },
            },
        },
    },
    responses: {
        201: {
            description: "Amount withdrawn from P2P offer successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "number", description: "ID of the offer" },
                            status: { type: "string", description: "Status of the offer" },
                            // Additional properties as needed
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
        if (offer.amount < body.amount) {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Insufficient offer amount",
            });
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
        const balance = wallet.balance + body.amount;
        await wallet.update({
            balance,
        }, {
            transaction,
        });
        const amount = offer.amount - body.amount;
        const status = amount === 0 ? "COMPLETED" : "ACTIVE";
        await offer.update({
            amount,
            status,
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
            description: `P2P offer withdrawn: ${offer.id}`,
        }, { transaction });
    });
    return {
        status: "Amount withdrawn successfully",
    };
};
