"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotification = exports.notifyUsersWithPermission = exports.saveNotification = void 0;
const db_1 = require("@b/db");
const Websocket_1 = require("@b/handler/Websocket");
const task_1 = require("./task");
const logger_1 = require("@b/utils/logger");
/**
 * Saves a notification to the database.
 *
 * @param {string} userId - The ID of the user to whom the notification is sent.
 * @param {string} title - The title of the notification.
 * @param {string} message - The message of the notification.
 * @param {string} type - The type of the notification.
 * @param {string} [link] - Optional link associated with the notification.
 * @returns {Promise<Notification>} The saved notification.
 */
async function saveNotification(userId, title, message, type, link) {
    try {
        return (await db_1.models.notification.create({
            userId,
            type,
            title,
            message,
            link,
        }));
    }
    catch (error) {
        (0, logger_1.logError)("notification", error, __filename);
        throw error;
    }
}
exports.saveNotification = saveNotification;
/**
 * Finds users with a role that has the specified permission and sends them a notification.
 *
 * @param permissionName - The name of the permission to check for.
 * @param title - The title of the notification.
 * @param message - The message of the notification.
 * @param type - The type of the notification.
 * @param link - Optional link associated with the notification.
 */
async function notifyUsersWithPermission(permissionName, title, message, type, link) {
    try {
        const users = await db_1.models.user.findAll({
            include: [
                {
                    model: db_1.models.role,
                    as: "role",
                    include: [
                        {
                            model: db_1.models.rolePermission,
                            as: "rolePermissions",
                            where: {
                                "$role.rolePermissions.permission.name$": permissionName,
                            },
                            include: [
                                {
                                    model: db_1.models.permission,
                                    as: "permission",
                                    required: true,
                                },
                            ],
                        },
                    ],
                    required: true,
                },
            ],
            attributes: ["id"],
        });
        // Loop through the users and send them notifications
        const notificationPromises = users.map((user) => saveNotification(user.id, title, message, type, link));
        // Wait for all notifications to be sent
        await Promise.all(notificationPromises);
    }
    catch (error) {
        (0, logger_1.logError)("notification", error, __filename);
        throw error;
    }
}
exports.notifyUsersWithPermission = notifyUsersWithPermission;
/**
 * Create a new notification and send it to the user.
 *
 * @param {string} userId - The ID of the user to send the notification to.
 * @param {string} type - The type of notification (SECURITY, SYSTEM, ACTIVITY).
 * @param {string} title - The title of the notification.
 * @param {string} message - The message of the notification.
 * @param {string} [link] - Optional link associated with the notification.
 * @param {string} [icon] - Optional icon associated with the notification.
 */
const handleNotification = async ({ userId, type, title, message, link, icon, }) => {
    try {
        const task = async () => {
            // Create the notification in the database
            const notification = await db_1.models.notification.create({
                userId,
                type,
                title,
                message,
                link,
                icon,
            });
            // Send the notification to the user
            await (0, Websocket_1.handleClientMessage)({
                type: "notifications",
                method: "create",
                clientId: userId,
                data: notification.get({ plain: true }),
            });
        };
        await task_1.taskQueue.add(task);
    }
    catch (error) {
        (0, logger_1.logError)("notification", error, __filename);
        throw error;
    }
};
exports.handleNotification = handleNotification;
