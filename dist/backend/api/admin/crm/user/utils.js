"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStoreSchema = exports.userUpdateSchema = exports.userSchema = exports.getUserCountsPerDay = void 0;
const utils_1 = require("@b/utils");
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
async function getUserCountsPerDay() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const users = await db_1.models.user.findAll({
        where: {
            createdAt: {
                [sequelize_1.Op.gte]: startDate, // Sequelize uses Op.gte for "greater than or equal" comparisons
            },
        },
        attributes: ["createdAt", "status", "emailVerified"], // Specify which fields to fetch
    });
    const counts = {
        registrations: {},
        activeUsers: {},
        bannedUsers: {},
        verifiedEmails: {},
    };
    users.forEach((user) => {
        if (!user.createdAt)
            return;
        const date = user.createdAt.toISOString().split("T")[0];
        counts.registrations[date] = (counts.registrations[date] || 0) + 1;
        if (user.status === "ACTIVE") {
            counts.activeUsers[date] = (counts.activeUsers[date] || 0) + 1;
        }
        if (user.status === "BANNED") {
            counts.bannedUsers[date] = (counts.bannedUsers[date] || 0) + 1;
        }
        if (user.emailVerified) {
            counts.verifiedEmails[date] = (counts.verifiedEmails[date] || 0) + 1;
        }
    });
    return {
        registrations: (0, utils_1.convertAndSortCounts)(counts.registrations),
        activeUsers: (0, utils_1.convertAndSortCounts)(counts.activeUsers),
        bannedUsers: (0, utils_1.convertAndSortCounts)(counts.bannedUsers),
        verifiedEmails: (0, utils_1.convertAndSortCounts)(counts.verifiedEmails),
    };
}
exports.getUserCountsPerDay = getUserCountsPerDay;
const schema_1 = require("@b/utils/schema"); // Adjust the import path as necessary
// Basic schema components
const id = (0, schema_1.baseStringSchema)("ID of the user");
const email = (0, schema_1.baseStringSchema)("Email of the user", 100, 0, false, "^[^@]+@[^@]+\\.[^@]+$", "example@site.com");
const avatar = (0, schema_1.baseStringSchema)("Avatar of the user", 255, 0, true);
const firstName = (0, schema_1.baseStringSchema)("First name of the user", 50);
const lastName = (0, schema_1.baseStringSchema)("Last name of the user", 50);
const emailVerified = (0, schema_1.baseBooleanSchema)("Email verification status");
const phone = (0, schema_1.baseStringSchema)("User's phone number", 10, 10, true, "^[0-9]{10}$", "1234567890"); // Fixed length for phone numbers with pattern
const status = (0, schema_1.baseEnumSchema)("Status of the user", [
    "ACTIVE",
    "INACTIVE",
    "BANNED",
    "SUSPENDED",
]);
const roleId = (0, schema_1.baseStringSchema)("Role ID associated with the user");
const twoFactor = (0, schema_1.baseBooleanSchema)("Whether two-factor authentication is enabled");
// Profile related components
const profile = {
    type: "object",
    nullable: true,
    properties: {
        bio: (0, schema_1.baseStringSchema)("Bio", 500),
        location: {
            type: "object",
            properties: {
                address: (0, schema_1.baseStringSchema)("Detailed address of the user"),
                city: (0, schema_1.baseStringSchema)("City"),
                country: (0, schema_1.baseStringSchema)("Country"),
                zip: (0, schema_1.baseStringSchema)("Zip code", 10, 5, false),
            },
        },
        social: {
            type: "object",
            properties: {
                facebook: (0, schema_1.baseStringSchema)("Facebook URL", 255, 0, true, "^https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+$", "http://facebook.com/yourusername"), // URL pattern
                twitter: (0, schema_1.baseStringSchema)("Twitter URL", 255, 0, true, "^https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+$", "http://twitter.com/yourusername"), // URL pattern
                dribbble: (0, schema_1.baseStringSchema)("Dribbble URL", 255, 0, true, "^https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+$", "http://dribbble.com/yourusername"), // URL pattern
                instagram: (0, schema_1.baseStringSchema)("Instagram URL", 255, 0, true, "^https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+$", "http://instagram.com/yourusername"), // URL pattern
                github: (0, schema_1.baseStringSchema)("Github URL", 255, 0, true, "^https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+$", "http://github.com/yourusername"), // URL pattern
                gitlab: (0, schema_1.baseStringSchema)("Gitlab URL", 255, 0, true, "^https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+$", "http://gitlab.com/yourusername"), // URL pattern
            },
        },
    },
};
const lastLogin = (0, schema_1.baseDateTimeSchema)("Last login date");
const lastFailedLogin = (0, schema_1.baseDateTimeSchema)("Last failed login date");
const failedLoginAttempts = (0, schema_1.baseIntegerSchema)("Number of failed login attempts");
const walletAddress = (0, schema_1.baseStringSchema)("Wallet address of the user");
const walletProvider = (0, schema_1.baseStringSchema)("Wallet provider of the user");
// Full user schema
exports.userSchema = {
    id,
    email,
    avatar,
    firstName,
    lastName,
    emailVerified,
    phone,
    status,
    roleId,
    twoFactor,
    profile,
    lastLogin,
    lastFailedLogin,
    failedLoginAttempts,
    walletAddress,
    walletProvider,
};
// Schema for updating a user
exports.userUpdateSchema = {
    type: "object",
    properties: {
        avatar,
        firstName,
        lastName,
        email,
        phone,
        status,
        emailVerified,
        twoFactor,
        profile,
        roleId,
    },
    required: ["email", "firstName", "lastName", "roleId"], // Ensure these are the fields you want to be required
};
exports.userStoreSchema = {
    description: `User created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.userSchema,
            },
        },
    },
};
