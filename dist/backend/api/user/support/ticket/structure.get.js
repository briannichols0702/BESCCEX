"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportTicketStructure = exports.metadata = void 0;
// /api/admin/support-tickets/structure.get.ts
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for support tickets",
    operationId: "getSupportTicketsStructure",
    tags: ["Support Tickets"],
    responses: {
        200: {
            description: "Form structure for support tickets",
            content: constants_1.structureSchema,
        },
    },
};
const supportTicketStructure = () => {
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const chatId = { type: "input", label: "Chat ID", name: "chatId" };
    const subject = { type: "input", label: "Subject", name: "subject" };
    const message = { type: "textarea", label: "Message", name: "message" };
    const importance = {
        type: "select",
        label: "Importance",
        name: "importance",
        options: [
            {
                value: "LOW",
                label: "Low",
            },
            {
                value: "MEDIUM",
                label: "Medium",
            },
            {
                value: "HIGH",
                label: "High",
            },
        ],
    };
    const type = {
        type: "select",
        label: "Type",
        name: "type",
        options: [
            {
                value: "LIVE",
                label: "Live",
            },
            {
                value: "SUPPORT",
                label: "Support",
            },
        ],
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            {
                value: "PENDING",
                label: "Pending",
                color: "warning",
            },
            {
                value: "OPEN",
                label: "Open",
                color: "info",
            },
            {
                value: "REPLIED",
                label: "Replied",
                color: "primary",
            },
            {
                value: "CLOSED",
                label: "Closed",
                color: "success",
            },
        ],
    };
    const createdAt = { type: "input", label: "Created At", name: "createdAt" };
    const user = { type: "input", label: "User", name: "user" };
    const chat = { type: "input", label: "Chat", name: "chat" };
    return {
        userId,
        chatId,
        subject,
        message,
        importance,
        status,
        createdAt,
        user,
        chat,
        type,
    };
};
exports.supportTicketStructure = supportTicketStructure;
exports.default = async () => {
    const { subject, message, importance, type } = (0, exports.supportTicketStructure)();
    return {
        set: [[subject, importance], message, type],
    };
};
