"use strict";
// /server/api/announcement/index.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const Websocket_1 = require("@b/handler/Websocket");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes an announcement",
    operationId: "deleteAnnouncement",
    tags: ["Admin", "Announcements"],
    parameters: (0, query_1.deleteRecordParams)("announcement"),
    responses: (0, query_1.deleteRecordResponses)("Announcement"),
    permission: "Access Announcement Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    const { id } = params;
    const message = (0, query_1.handleSingleDelete)({
        model: "announcement",
        id,
        query,
    });
    (0, Websocket_1.handleRouteClientsMessage)({
        type: "announcements",
        method: "delete",
        id,
    });
    return message;
};
