"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const Websocket_1 = require("@b/handler/Websocket");
exports.metadata = {};
exports.default = async (data, message) => {
    if (typeof message === "string") {
        message = JSON.parse(message);
    }
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        return;
    }
    const { type, payload } = message;
    const notifications = await db_1.models.notification.findAll({
        where: { userId: user.id },
        order: [["createdAt", "DESC"]],
    });
    await (0, Websocket_1.handleClientMessage)({
        type: "notifications",
        method: "create",
        clientId: user.id,
        data: notifications.map((n) => n.get({ plain: true })),
    });
    const announcements = await db_1.models.announcement.findAll({
        where: { status: true },
        order: [["createdAt", "DESC"]],
    });
    await (0, Websocket_1.handleClientMessage)({
        type: "announcements",
        method: "create",
        clientId: user.id,
        data: announcements.map((a) => a.get({ plain: true })),
    });
};
