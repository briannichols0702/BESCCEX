"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
const Websocket_1 = require("@b/handler/Websocket");
const notifications_1 = require("@b/utils/notifications");
exports.metadata = {
    summary: "Marks a P2P trade as paid",
    description: "Updates the status of a P2P trade to paid after payment confirmation.",
    operationId: "markTradeAsPaid",
    tags: ["P2P", "Trade"],
    requiresAuth: true,
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "ID of the trade" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        txHash: {
                            type: "string",
                            description: "Transaction hash of the payment",
                        },
                    },
                    required: ["txHash"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Trade marked as paid successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "ID of the trade" },
                            status: { type: "string", description: "Status of the trade" },
                            txHash: {
                                type: "string",
                                description: "Transaction hash of the payment",
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
    const { params, body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    const { txHash } = body;
    try {
        const result = await handleTradePayment(id, user.id, txHash);
        return result;
    }
    catch (error) {
        if (error.statusCode) {
            return { error: error.message };
        }
        return { error: "Failed to mark trade as paid" };
    }
};
async function handleTradePayment(id, userId, txHash) {
    return await db_1.sequelize.transaction(async (transaction) => {
        const trade = await db_1.models.p2pTrade.findOne({
            where: { id, userId },
            include: [
                {
                    model: db_1.models.user,
                    as: "user",
                    attributes: ["id", "email", "firstName", "lastName"],
                },
                {
                    model: db_1.models.user,
                    as: "seller",
                    attributes: ["id", "email", "firstName", "lastName"],
                },
            ],
            transaction,
        });
        if (!trade)
            throw (0, error_1.createError)({ statusCode: 404, message: "Trade not found" });
        if (trade.status !== "PENDING")
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Trade can only be marked as paid if it is pending",
            });
        await trade.update({
            status: "PAID",
            txHash,
        }, {
            transaction,
        });
        try {
            const buyer = trade.user;
            const seller = trade.seller;
            await (0, utils_1.sendP2PTradePaymentConfirmationEmail)(seller, buyer, trade, txHash);
            await (0, notifications_1.handleNotification)({
                userId: seller.id,
                title: "Trade Paid",
                message: `Trade with ${buyer.firstName} ${buyer.lastName} has been paid`,
                type: "ACTIVITY",
            });
        }
        catch (error) {
            console.error("Error sending email", error);
        }
        (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id }, {
            method: "update",
            data: {
                status: "PAID",
                txHash,
                updatedAt: new Date(),
            },
        });
        return { id: trade.id, status: "PAID", txHash };
    });
}
