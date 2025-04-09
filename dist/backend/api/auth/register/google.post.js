"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const google_auth_library_1 = require("google-auth-library");
const db_1 = require("@b/db");
const affiliate_1 = require("@b/utils/affiliate");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
const client = new google_auth_library_1.OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
exports.metadata = {
    summary: "Registers a new user with Google",
    operationId: "registerUserWithGoogle",
    tags: ["Auth"],
    description: "Registers a new user using Google and returns a session token",
    requiresAuth: false,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.userRegisterSchema,
            },
        },
    },
    responses: {
        200: {
            description: "User registered successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.userRegisterResponseSchema,
                    },
                },
            },
        },
        500: query_1.serverErrorResponse,
    },
};
async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}
async function fetchGoogleUserInfo(token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user info from Google");
    }
    return response.json();
}
// Function to sanitize names by removing non-letter characters (supports Unicode, allows spaces)
function sanitizeName(name) {
    return name.replace(/[^\p{L}\s]/gu, "");
}
// Function to validate names (supports Unicode, allows spaces)
function isValidName(name) {
    return /^[\p{L}\s]+$/u.test(name);
}
exports.default = async (data) => {
    const { body } = data;
    const { token, ref } = body;
    let payload;
    try {
        payload = await verifyGoogleToken(token);
    }
    catch (error) {
        payload = await fetchGoogleUserInfo(token);
    }
    if (!payload) {
        throw new Error("Invalid Google token");
    }
    const { sub: googleId, email, given_name: firstName, family_name: lastName, } = payload;
    if (!googleId || !email || !firstName || !lastName) {
        throw new Error("Incomplete user information from Google");
    }
    // Sanitize and validate names
    const sanitizedFirstName = sanitizeName(firstName);
    const sanitizedLastName = sanitizeName(lastName);
    if (!isValidName(sanitizedFirstName) || !isValidName(sanitizedLastName)) {
        throw new Error("First name and last name must only contain letters and spaces");
    }
    // Check if user already exists
    let user = await db_1.models.user.findOne({ where: { email } });
    let isNewUser = false;
    if (!user) {
        const roleName = process.env.NEXT_PUBLIC_DEMO_STATUS === "true" ? "Admin" : "User";
        await db_1.models.role.upsert({ name: roleName });
        // Fetch the role to get its ID
        const role = await db_1.models.role.findOne({ where: { name: roleName } });
        if (!role)
            throw new Error("Role not found after upsert.");
        // Create the user with the roleId
        user = await db_1.models.user.create({
            firstName: sanitizedFirstName,
            lastName: sanitizedLastName,
            email,
            roleId: role.id,
            emailVerified: true,
        });
        // Create a provider_user entry
        await db_1.models.providerUser.create({
            provider: "GOOGLE",
            providerUserId: googleId,
            userId: user.id,
        });
        try {
            if (ref)
                await (0, affiliate_1.handleReferralRegister)(ref, user.id);
        }
        catch (error) {
            console.error("Error handling referral registration:", error);
        }
        isNewUser = true;
    }
    else {
        // Check if the user has a provider_user entry
        const providerUser = await db_1.models.providerUser.findOne({
            where: { providerUserId: googleId, provider: "GOOGLE" },
        });
        if (!providerUser) {
            // Create a provider_user entry
            await db_1.models.providerUser.create({
                provider: "GOOGLE",
                providerUserId: googleId,
                userId: user.id,
            });
        }
    }
    return await (0, utils_1.returnUserWithTokens)({
        user: user,
        message: isNewUser
            ? "You have been registered successfully"
            : "You have been logged in successfully",
    });
};
