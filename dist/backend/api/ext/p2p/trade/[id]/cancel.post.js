"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTradeCancellation = exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
const Websocket_1 = require("@b/handler/Websocket");
const notifications_1 = require("@b/utils/notifications");
exports.metadata = {
    summary: "Cancels a P2P trade",
    description: "Allows a user to cancel a pending P2P trade.",
    operationId: "cancelTrade",
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
    responses: {
        200: {
            description: "Trade cancelled successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "ID of the trade" },
                            status: { type: "string", description: "Status of the trade" },
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
    const { params, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    try {
        const result = await handleTradeCancellation(id);
        return result;
    }
    catch (error) {
        if (error.message === "Trade not found") {
            return { error: "Trade not found" };
        }
        else if (error.message === "Trade can only be cancelled if it is pending") {
            return { error: "Trade can only be cancelled if it is pending" };
        }
        else {
            return { error: "Failed to cancel trade" };
        }
    }
};
async function handleTradeCancellation(id, isAdmin = false) {
    const trade = await db_1.models.p2pTrade.findOne({
        where: { id },
        include: [
            { model: db_1.models.p2pOffer, as: "offer" },
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
    });
    if (!trade)
        throw new Error("Trade not found");
    await db_1.sequelize.transaction(async (transaction) => {
        if (trade.status !== "PENDING" && !isAdmin)
            throw new Error("Trade can only be cancelled if it is pending");
        await db_1.models.p2pOffer.update({
            inOrder: db_1.sequelize.literal(`inOrder - ${trade.amount}`),
        }, {
            where: { id: trade.offerId },
            transaction,
        });
        await trade.update({
            status: "CANCELLED",
        }, {
            transaction,
        });
        await db_1.models.p2pDispute.destroy({
            where: { tradeId: trade.id },
            transaction,
        });
        await db_1.models.p2pCommission.destroy({
            where: { tradeId: trade.id },
            transaction,
        });
        await db_1.models.p2pEscrow.destroy({
            where: { tradeId: trade.id },
            transaction,
        });
    });
    try {
        const user = trade.user;
        const seller = trade.seller;
        await (0, utils_1.sendP2PTradeCancellationEmail)(user, trade);
        await (0, utils_1.sendP2PTradeCancellationEmail)(seller, trade);
        await (0, notifications_1.handleNotification)({
            userId: trade.userId,
            title: "Trade Cancelled",
            message: `Trade #${trade.id} has been cancelled`,
            type: "ACTIVITY",
        });
        await (0, notifications_1.handleNotification)({
            userId: trade.sellerId,
            title: "Trade Cancelled",
            message: `Trade #${trade.id} has been cancelled`,
            type: "ACTIVITY",
        });
    }
    catch (error) {
        throw new Error("Failed to send email");
    }
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id }, {
        method: "update",
        data: {
            status: trade.status,
            updatedAt: new Date(),
        },
    });
    return { id: trade.id, status: trade.status };
}
exports.handleTradeCancellation = handleTradeCancellation;
