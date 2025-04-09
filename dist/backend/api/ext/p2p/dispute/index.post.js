"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("./utils");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const notifications_1 = require("@b/utils/notifications");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a dispute for a specific trade",
    description: "Allows a user to raise a dispute for an ongoing trade.",
    operationId: "createUserDispute",
    tags: ["P2P", "Disputes"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        tradeId: {
                            type: "number",
                            description: "ID of the trade involved in the dispute",
                        },
                        reason: { type: "string", description: "Reason for the dispute" },
                    },
                    required: ["tradeId", "reason"],
                },
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.p2pDisputeStoreSchema, "Dispute"),
};
exports.default = async (data) => {
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    try {
        const userPk = await db_1.models.user.findByPk(user.id);
        if (!userPk) {
            throw (0, error_1.createError)({
                statusCode: 404,
                message: "User not found",
            });
        }
        const trade = await db_1.models.p2pTrade.findByPk(body.tradeId);
        if (!trade) {
            throw (0, error_1.createError)({
                statusCode: 404,
                message: "Trade not found",
            });
        }
        const dispute = await db_1.models.p2pDispute.create({
            tradeId: body.tradeId,
            raisedById: user.id,
            reason: body.reason,
            status: "PENDING",
        });
        const disputedUser = await db_1.models.user.findByPk(trade.userId === user.id ? trade.sellerId : trade.userId);
        if (disputedUser) {
            await (0, utils_1.sendP2PDisputeOpenedEmail)(disputedUser, userPk, trade, body.reason);
            await (0, notifications_1.handleNotification)({
                userId: disputedUser.id,
                title: "Dispute raised",
                message: `A dispute has been raised for trade #${trade.id}`,
                type: "ACTIVITY",
            });
        }
        return {
            message: "Dispute created successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to create dispute: ${error.message}`,
        });
    }
};
