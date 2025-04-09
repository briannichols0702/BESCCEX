"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const Websocket_1 = require("@b/handler/Websocket");
const error_1 = require("@b/utils/error");
const utils_1 = require("./utils");
exports.metadata = {};
exports.default = async (data, parsedMessage) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { payload } = parsedMessage;
    if (!payload.id)
        return;
    const trade = await db_1.models.p2pTrade.findByPk(payload.id, {
        include: [
            {
                model: db_1.models.user,
                as: "seller",
                attributes: ["email", "avatar", "firstName", "lastName", "lastLogin"],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["email", "avatar", "firstName", "lastName", "lastLogin"],
            },
        ],
    });
    if (!trade)
        return;
    if (trade.status === "CANCELLED") {
        (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id: payload.id }, {
            method: "update",
            data: {
                status: trade.status,
                updatedAt: new Date(),
            },
        });
        throw (0, error_1.createError)({ statusCode: 400, message: "Ticket is cancelled" });
    }
    if (!payload.message)
        return;
    const { type, time, userId } = payload.message;
    // Validate message structure
    if (!type || !time || !userId)
        return;
    // Filter out irrelevant messages
    if (type !== "buyer" && type !== "seller")
        return;
    if (userId !== user.id)
        return;
    if (!trade.sellerId && type === "seller")
        trade.sellerId = user.id;
    // Update trade messages
    const messages = trade.messages || [];
    messages.push(payload.message);
    trade.messages = messages;
    await trade.save();
    try {
        const receiver = type === "seller" ? trade.user : trade.seller;
        const sender = type === "seller" ? trade.seller : trade.user;
        await (0, utils_1.sendP2PTradeReplyEmail)(receiver, sender, trade, payload.message);
    }
    catch (error) {
        console.error("Error sending email", error);
    }
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id: payload.id }, {
        method: "reply",
        data: {
            message: payload.message,
            updatedAt: new Date(),
        },
    });
};
