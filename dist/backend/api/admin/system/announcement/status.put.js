"use strict";
// /server/api/announcement/status.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const Websocket_1 = require("@b/handler/Websocket");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of announcements",
    operationId: "bulkUpdateAnnouncementStatus",
    tags: ["Admin", "Announcements"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of announcement IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "boolean",
                            description: "New status to apply to the announcements (true for active, false for inactive)",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Announcement"),
    requiresAuth: true,
    permission: "Access Announcement Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    const msg = (0, query_1.updateStatus)("announcement", ids, status);
    (0, Websocket_1.handleRouteClientsMessage)({
        type: "announcements",
        model: "announcement",
        method: "update",
        status,
        id: ids,
    });
    return msg;
};
