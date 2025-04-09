"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("./utils");
// /server/api/announcement/index.post.ts
const query_1 = require("@b/utils/query");
const utils_2 = require("./utils");
const Websocket_1 = require("@b/handler/Websocket");
exports.metadata = {
    summary: "Stores a new Announcement",
    operationId: "storeAnnouncement",
    tags: ["Admin", "Announcements"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.announcementUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_2.announcementSchema, "Announcement"),
    requiresAuth: true,
    permission: "Access Announcement Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { type, title, message, link, status } = body;
    const announcement = await (0, query_1.storeRecord)({
        model: "announcement",
        data: {
            type,
            title,
            message,
            link,
            status,
        },
        returnResponse: true,
    });
    (0, Websocket_1.handleRouteClientsMessage)({
        type: "announcements",
        method: "create",
        data: announcement.record,
    });
    return announcement.message;
};
