"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const utils_1 = require("../../utils");
const query_1 = require("@b/utils/query");
const Websocket_1 = require("@b/handler/Websocket");
const notifications_1 = require("@b/utils/notifications");
exports.metadata = {
    summary: "Cancels a P2P trade dispute",
    description: "Cancels an existing dispute on a P2P trade.",
    operationId: "cancelDispute",
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
            description: "Dispute cancelled successfully",
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
        const result = await cancelDisputeTradeQuery(id, user.id);
        return result;
    }
    catch (error) {
        if (error.statusCode) {
            return { error: error.message };
        }
        return { error: "Failed to cancel dispute" };
    }
};
async function cancelDisputeTradeQuery(id, userId = null) {
    return await db_1.sequelize.transaction(async (transaction) => {
        const trade = await db_1.models.p2pTrade.findOne({
            where: { id },
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
        if (trade.status !== "DISPUTE_OPEN")
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Trade can only be cancelled if it is in a dispute",
            });
        const dispute = await db_1.models.p2pDispute.findOne({
            where: { tradeId: trade.id },
            include: [
                {
                    model: db_1.models.user,
                    as: "raisedBy",
                    attributes: ["id", "email", "firstName", "lastName"],
                },
            ],
            transaction,
        });
        if (!dispute)
            throw (0, error_1.createError)({ statusCode: 404, message: "Dispute not found" });
        if (userId && userId !== trade.userId && userId !== trade.sellerId) {
            throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
        }
        if (userId && userId === trade.userId && userId !== dispute.raisedById) {
            throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
        }
        if (userId && userId === trade.sellerId && userId !== dispute.raisedById) {
            throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
        }
        await dispute.update({
            status: "CANCELLED",
        }, {
            transaction,
        });
        await trade.update({
            status: "PAID",
        }, {
            transaction,
        });
        try {
            const user = trade.user;
            const seller = trade.seller;
            await (0, utils_1.sendP2PDisputeClosingEmail)(user, trade);
            await (0, utils_1.sendP2PDisputeClosingEmail)(seller, trade);
            await (0, notifications_1.handleNotification)({
                userId: user.id,
                title: "Dispute closed",
                message: `The dispute for trade #${trade.id} has been closed`,
                type: "ACTIVITY",
            });
            await (0, notifications_1.handleNotification)({
                userId: seller.id,
                title: "Dispute closed",
                message: `The dispute for trade #${trade.id} has been closed`,
                type: "ACTIVITY",
            });
        }
        catch (error) {
            console.error("Error sending dispute closing email", error);
        }
        (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id }, {
            method: "update",
            data: {
                status: "PAID",
                p2pDisputes: [
                    {
                        ...dispute.get({ plain: true }),
                        status: "CANCELLED",
                    },
                ],
                updatedAt: new Date(),
            },
        });
        return { id: trade.id, status: "PAID" };
    });
}
