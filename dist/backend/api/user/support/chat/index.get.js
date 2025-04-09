"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateLiveChat = exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Retrieves or creates a live chat ticket",
    description: "Fetches the existing live chat ticket for the authenticated user, or creates a new one if none exists.",
    operationId: "getOrCreateLiveChat",
    tags: ["Support"],
    requiresAuth: true,
    responses: (0, query_1.createRecordResponses)("Support Ticket"),
};
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    return getOrCreateLiveChat(user.id);
};
async function getOrCreateLiveChat(userId) {
    // Check for existing LIVE ticket
    let ticket = await db_1.models.supportTicket.findOne({
        where: {
            userId,
            type: "LIVE", // Ticket type is LIVE
            status: { [sequelize_1.Op.ne]: "CLOSED" }, // Exclude closed tickets
        },
        include: [
            {
                model: db_1.models.user,
                as: "agent",
                attributes: ["avatar", "firstName", "lastName", "lastLogin"],
            },
        ],
    });
    // If no LIVE ticket exists, create one
    if (!ticket) {
        ticket = await db_1.models.supportTicket.create({
            userId,
            type: "LIVE",
            subject: "Live Chat",
            messages: JSON.stringify([]),
            importance: "LOW",
            status: "PENDING",
        });
    }
    return ticket.get({ plain: true });
}
exports.getOrCreateLiveChat = getOrCreateLiveChat;
