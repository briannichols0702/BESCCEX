"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const google_auth_library_1 = require("google-auth-library");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const client = new google_auth_library_1.OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
exports.metadata = {
    summary: "Logs in a user with Google",
    operationId: "loginUserWithGoogle",
    tags: ["Auth"],
    description: "Logs in a user using Google and returns a session token",
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
            description: "User logged in successfully",
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
exports.default = async (data) => {
    const { body } = data;
    const { token } = body;
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
    // Check if user exists
    const user = await db_1.models.user.findOne({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }
    // Validate user status
    if (user.status === "BANNED") {
        throw new Error("Your account has been banned. Please contact support.");
    }
    if (user.status === "SUSPENDED") {
        throw new Error("Your account is suspended. Please contact support.");
    }
    if (user.status === "INACTIVE") {
        throw new Error("Your account is inactive. Please verify your email or contact support.");
    }
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
    return await (0, utils_1.returnUserWithTokens)({
        user,
        message: "You have been logged in successfully",
    });
};
