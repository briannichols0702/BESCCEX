"use strict";
// /server/api/announcement/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const Websocket_1 = require("@b/handler/Websocket");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes announcements by IDs",
    operationId: "bulkDeleteAnnouncements",
    tags: ["Admin", "Announcements"],
    parameters: (0, query_1.commonBulkDeleteParams)("Announcements"),
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of announcement IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Announcements"),
    requiresAuth: true,
    permission: "Access Announcement Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    const message = (0, query_1.handleBulkDelete)({
        model: "announcement",
        ids,
        query,
    });
    (0, Websocket_1.handleRouteClientsMessage)({
        type: "announcements",
        method: "delete",
        id: ids,
    });
    return message;
};
