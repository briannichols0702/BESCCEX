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
    summary: "Disputes a P2P trade",
    description: "Initiates a dispute for a specified P2P trade.",
    operationId: "disputeTrade",
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
                        reason: { type: "string", description: "Reason for the dispute" },
                    },
                    required: ["reason"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Dispute initiated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "ID of the trade" },
                            status: { type: "string", description: "Status of the trade" },
                            reason: { type: "string", description: "Reason for the dispute" },
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
    const { reason } = body;
    try {
        const result = await disputeTradeQuery(id, reason, user.id);
        return result;
    }
    catch (error) {
        if (error.statusCode) {
            return { error: error.message };
        }
        return { error: "Failed to initiate dispute" };
    }
};
async function disputeTradeQuery(id, reason, userId) {
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
        if (trade.status !== "PAID")
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Trade can only be disputed if it is paid",
            });
        const dispute = await db_1.models.p2pDispute.create({
            tradeId: trade.id,
            raisedById: userId,
            reason,
            status: "PENDING",
        }, { transaction });
        await trade.update({
            status: "DISPUTE_OPEN",
        }, {
            transaction,
        });
        const disputer = userId === trade.userId ? trade.user : trade.seller;
        const disputed = userId === trade.userId ? trade.seller : trade.user;
        try {
            await (0, utils_1.sendP2PDisputeOpenedEmail)(disputed, disputer, trade, reason);
            await (0, notifications_1.handleNotification)({
                userId: disputed.id,
                title: "Dispute raised",
                message: `A dispute has been raised for trade #${trade.id}`,
                type: "ACTIVITY",
            });
        }
        catch (error) {
            console.error("Error sending dispute email", error);
        }
        (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id }, {
            method: "update",
            data: {
                status: "DISPUTE_OPEN",
                p2pDisputes: [
                    {
                        ...dispute.get({ plain: true }),
                        raisedBy: disputer,
                    },
                ],
                updatedAt: new Date(),
            },
        });
        return { id: trade.id, status: "DISPUTE_OPEN", reason };
    });
}
