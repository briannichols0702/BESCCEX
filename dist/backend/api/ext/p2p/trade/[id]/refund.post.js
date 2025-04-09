"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const Websocket_1 = require("@b/handler/Websocket");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Refunds a P2P trade",
    description: "Processes a refund for a trade that is in a dispute or under escrow review.",
    operationId: "refundTrade",
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
            description: "Trade refunded successfully",
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
        const result = await handleTradeRefund(id, user.id);
        return result;
    }
    catch (error) {
        if (error.statusCode) {
            return { error: error.message };
        }
        return { error: "Failed to refund trade" };
    }
};
async function handleTradeRefund(id, userId) {
    return await db_1.sequelize.transaction(async (transaction) => {
        const trade = await db_1.models.p2pTrade.findOne({
            where: { id, userId },
            transaction,
        });
        if (!trade) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Trade not found" });
        }
        if (!["DISPUTE_OPEN", "ESCROW_REVIEW"].includes(trade.status)) {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Trade can only be refunded if it is in a dispute or under escrow review",
            });
        }
        await db_1.models.p2pTrade.update({
            status: "REFUNDED",
        }, {
            where: { id: trade.id },
            transaction,
        });
        (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id }, {
            method: "update",
            data: {
                status: "REFUNDED",
                updatedAt: new Date(),
            },
        });
        return { id: trade.id, status: "REFUNDED" };
    });
}
