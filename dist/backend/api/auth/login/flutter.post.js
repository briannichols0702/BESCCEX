"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const error_1 = require("@b/utils/error");
const passwords_1 = require("@b/utils/passwords");
const db_1 = require("@b/db");
const date_fns_1 = require("date-fns");
const otplib_1 = require("otplib");
const utils_1 = require("../utils");
const emails_1 = require("@b/utils/emails");
exports.metadata = {
    summary: "Logs in a user",
    description: "Logs in a user and returns a session token",
    operationId: "loginUser",
    tags: ["Auth"],
    requiresAuth: false,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            description: "Email of the user",
                        },
                        password: {
                            type: "string",
                            description: "Password of the user",
                        },
                    },
                    required: ["email", "password"],
                },
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
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                            twoFactor: {
                                type: "object",
                                properties: {
                                    enabled: {
                                        type: "boolean",
                                        description: "2FA enabled status",
                                    },
                                    type: {
                                        type: "string",
                                        description: "Type of 2FA",
                                    },
                                },
                            },
                            id: {
                                type: "string",
                                description: "User ID",
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: "Invalid request (e.g., invalid email or password)",
        },
        401: {
            description: "Unauthorized (e.g., incorrect email or password)",
        },
    },
};
exports.default = async (data) => {
    const { email, password } = data.body;
    const user = await findUserByEmail(email);
    await handleEmailVerification(user);
    await validatePassword(user, password);
    await handleLoginAttempts(user);
    if (await isTwoFactorRequired(user)) {
        return await handleTwoFactorAuthentication(user);
    }
    return await (0, utils_1.returnUserWithTokens)({
        user,
        message: "You have been logged in successfully",
    });
};
// Helper Functions
async function findUserByEmail(email) {
    const user = await db_1.models.user.findOne({
        where: { email },
        include: {
            model: db_1.models.twoFactor,
            as: "twoFactor",
        },
    });
    if (!user || !user.password) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Incorrect email or password",
        });
    }
    // Validate user status
    if (user.status === "BANNED") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Your account has been banned. Please contact support.",
        });
    }
    if (user.status === "SUSPENDED") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Your account is suspended. Please contact support.",
        });
    }
    if (user.status === "INACTIVE") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Your account is inactive. Please verify your email or contact support.",
        });
    }
    return user;
}
async function handleEmailVerification(user) {
    if (process.env.NEXT_PUBLIC_VERIFY_EMAIL_STATUS === "true" &&
        !user.emailVerified &&
        user.email) {
        await (0, utils_1.sendEmailVerificationToken)(user.id, user.email);
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "User email not verified. Verification email sent.",
        });
    }
}
async function validatePassword(user, password) {
    const isPasswordValid = await (0, passwords_1.verifyPassword)(user.password, password);
    if (!isPasswordValid) {
        await incrementFailedLoginAttempts(user);
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Incorrect email or password",
        });
    }
}
async function incrementFailedLoginAttempts(user) {
    var _a;
    await db_1.models.user.update({
        failedLoginAttempts: ((_a = user.failedLoginAttempts) !== null && _a !== void 0 ? _a : 0) + 1,
        lastFailedLogin: new Date(),
    }, { where: { email: user.email } });
}
async function handleLoginAttempts(user) {
    var _a, _b;
    const blockedUntil = (0, date_fns_1.addMinutes)((_a = user.lastFailedLogin) !== null && _a !== void 0 ? _a : 0, 5);
    if (((_b = user.failedLoginAttempts) !== null && _b !== void 0 ? _b : 0) >= 5 && blockedUntil > new Date()) {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Too many failed login attempts, account temporarily blocked",
        });
    }
    await resetFailedLoginAttempts(user);
}
async function resetFailedLoginAttempts(user) {
    await db_1.models.user.update({
        failedLoginAttempts: 0,
        lastFailedLogin: null,
    }, { where: { email: user.email } });
}
async function isTwoFactorRequired(user) {
    var _a;
    return (((_a = user.twoFactor) === null || _a === void 0 ? void 0 : _a.enabled) && process.env.NEXT_PUBLIC_2FA_STATUS === "true");
}
async function handleTwoFactorAuthentication(user) {
    var _a;
    const type = (_a = user.twoFactor) === null || _a === void 0 ? void 0 : _a.type;
    otplib_1.authenticator.options = { window: 2 };
    const otp = otplib_1.authenticator.generate(user.twoFactor.secret);
    switch (type) {
        case "SMS":
            await sendSmsOtp(user.phone, otp);
            break;
        case "EMAIL":
            await sendEmailOtp(user.email, user.firstName, otp);
            break;
        case "APP":
            // Handle APP OTP logic if needed
            break;
        default:
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Invalid 2FA type",
            });
    }
    return {
        twoFactor: {
            enabled: true,
            type,
        },
        id: user.id,
        message: "2FA required",
    };
}
async function sendSmsOtp(phoneNumber, otp) {
    if (process.env.NEXT_PUBLIC_2FA_SMS_STATUS !== "true" ||
        !process.env.APP_TWILIO_VERIFY_SERVICE_SID) {
        throw (0, error_1.createError)({ statusCode: 400, message: "SMS 2FA is not enabled" });
    }
    const twilio = (await Promise.resolve().then(() => __importStar(require("twilio")))).default;
    const twilioClient = twilio(constants_1.APP_TWILIO_ACCOUNT_SID, constants_1.APP_TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: process.env.APP_TWILIO_PHONE_NUMBER,
        to: phoneNumber,
    });
}
async function sendEmailOtp(email, firstName, otp) {
    if (process.env.NEXT_PUBLIC_2FA_EMAIL_STATUS !== "true") {
        throw (0, error_1.createError)({ statusCode: 400, message: "Email 2FA is not enabled" });
    }
    await emails_1.emailQueue.add({
        emailData: {
            TO: email,
            FIRSTNAME: firstName,
            TOKEN: otp,
        },
        emailType: "OTPTokenVerification",
    });
}
