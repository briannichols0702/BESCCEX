"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const passwords_1 = require("@b/utils/passwords");
const db_1 = require("@b/db");
const affiliate_1 = require("@b/utils/affiliate");
const utils_1 = require("../utils");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Registers a new user",
    operationId: "registerUser",
    tags: ["Auth"],
    description: "Registers a new user and returns a session token",
    requiresAuth: false,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        firstName: {
                            type: "string",
                            description: "First name of the user",
                        },
                        lastName: {
                            type: "string",
                            description: "Last name of the user",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "Email of the user",
                        },
                        password: {
                            type: "string",
                            description: "Password of the user",
                        },
                        ref: {
                            type: "string",
                            description: "Referral code",
                        },
                    },
                    required: ["firstName", "lastName", "email", "password"],
                },
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
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                            cookies: {
                                type: "object",
                                properties: {
                                    accessToken: {
                                        type: "string",
                                        description: "Access token",
                                    },
                                    sessionId: {
                                        type: "string",
                                        description: "Session ID",
                                    },
                                    csrfToken: {
                                        type: "string",
                                        description: "CSRF token",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: "Invalid request (e.g., email already in use)",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Error message",
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.default = async (data) => {
    const { body } = data;
    const { firstName, lastName, email, password, ref } = body;
    const existingUser = await db_1.models.user.findOne({ where: { email } });
    if (existingUser && existingUser.email) {
        if (!existingUser.emailVerified &&
            process.env.NEXT_PUBLIC_VERIFY_EMAIL_STATUS === "true") {
            await (0, utils_1.sendEmailVerificationToken)(existingUser.id, existingUser.email);
            return {
                message: "User already registered but email not verified. Verification email sent.",
            };
        }
        throw new Error("Email already in use");
    }
    if (!(0, passwords_1.validatePassword)(password)) {
        throw new Error("Invalid password format");
    }
    const hashedPassword = await (0, passwords_1.hashPassword)(password);
    // Upsert the 'User' role
    await db_1.models.role.upsert({ name: "User" });
    // Upsert the appropriate role based on NEXT_PUBLIC_DEMO_STATUS
    const roleName = process.env.NEXT_PUBLIC_DEMO_STATUS === "true" ? "Admin" : "User";
    await db_1.models.role.upsert({ name: roleName });
    // Fetch the role to get its ID
    const role = await db_1.models.role.findOne({ where: { name: roleName } });
    if (!role)
        throw new Error("Role not found after upsert.");
    // Create the user with the roleId
    const newUser = await db_1.models.user.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId: role.id,
        emailVerified: false,
    });
    if (!newUser.email) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Error creating user",
        });
    }
    try {
        if (ref)
            await (0, affiliate_1.handleReferralRegister)(ref, newUser.id);
    }
    catch (error) {
        console.error("Error handling referral registration:", error);
    }
    if (process.env.NEXT_PUBLIC_VERIFY_EMAIL_STATUS === "true") {
        await (0, utils_1.sendEmailVerificationToken)(newUser.id, newUser.email);
        return {
            message: "Registration successful, please verify your email",
        };
    }
    else {
        return await (0, utils_1.returnUserWithTokens)({
            user: newUser,
            message: "You have been registered successfully",
        });
    }
};
