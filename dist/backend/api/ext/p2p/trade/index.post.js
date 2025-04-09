"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const utils_1 = require("./utils");
const query_1 = require("@b/utils/query");
const notifications_1 = require("@b/utils/notifications");
exports.metadata = {
    summary: "Initiates a new P2P trade",
    description: "Creates a new trade for a specified offer by a user.",
    operationId: "createUserTrade",
    tags: ["P2P", "Trade"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        offerId: { type: "string", description: "ID of the P2P offer" },
                        amount: { type: "number", description: "Amount to trade" },
                    },
                    required: ["offerId", "amount"],
                },
            },
        },
    },
    responses: {
        201: {
            description: "Trade initiated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "Trade ID" },
                            status: {
                                type: "string",
                                description: "Current status of the trade",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Trade"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { offerId, amount } = body;
    if (!offerId || !amount) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Offer ID and amount are required",
        });
    }
    if (amount <= 0) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Amount must be greater than 0",
        });
    }
    return await db_1.sequelize.transaction(async (transaction) => {
        const offer = await db_1.models.p2pOffer.findByPk(offerId, { transaction });
        if (!offer)
            throw (0, error_1.createError)({ statusCode: 404, message: "Offer not found" });
        const remainingAmount = offer.amount - offer.inOrder;
        if (amount > remainingAmount)
            throw (0, error_1.createError)({
                statusCode: 400,
                message: `Amount exceeds remaining offer amount of ${remainingAmount}`,
            });
        const trade = await db_1.models.p2pTrade.create({
            userId: user.id,
            sellerId: offer.userId,
            offerId,
            amount,
            status: "PENDING",
        }, { transaction });
        let status = offer.status;
        if (offer.amount === offer.inOrder + amount) {
            status = "COMPLETED";
        }
        await offer.update({
            status,
            inOrder: offer.inOrder + amount,
        }, {
            transaction,
        });
        try {
            const seller = await db_1.models.user.findByPk(offer.userId, { transaction });
            if (!seller)
                throw (0, error_1.createError)({ statusCode: 404, message: "Seller not found" });
            if (status === "COMPLETED") {
                await (0, utils_1.sendP2POfferAmountDepletionEmail)(seller, offer, 0);
                await (0, notifications_1.handleNotification)({
                    userId: seller.id,
                    title: "Offer Completed",
                    message: `Offer #${offer.id} has been completed`,
                    type: "ACTIVITY",
                });
            }
            const buyer = await db_1.models.user.findByPk(user.id, { transaction });
            await (0, utils_1.sendP2PTradeSaleConfirmationEmail)(seller, buyer, trade, offer);
            await (0, notifications_1.handleNotification)({
                userId: user.id,
                title: "Trade Initiated",
                message: `Trade with ${seller.firstName} ${seller.lastName} has been initiated`,
                type: "ACTIVITY",
            });
        }
        catch (error) {
            console.error(error);
        }
        return trade;
    });
};
