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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const otplib_1 = require("otplib");
const qrcode_1 = __importDefault(require("qrcode"));
const emails_1 = require("@b/utils/emails");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Generates an OTP secret",
    operationId: "generateOTPSecret",
    tags: ["Auth"],
    description: "Generates an OTP secret for the user",
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            enum: ["EMAIL", "SMS", "APP"],
                            description: "Type of 2FA",
                        },
                        phoneNumber: {
                            type: "string",
                            description: "Phone number for SMS OTP",
                        },
                    },
                    required: ["type"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP secret generated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            secret: {
                                type: "string",
                                description: "Generated OTP secret",
                            },
                            qrCode: {
                                type: "string",
                                description: "QR code for APP OTP",
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: "Invalid request",
        },
        401: {
            description: "Unauthorized",
        },
    },
};
exports.default = async (data) => {
    const { body, user } = data;
    if (!user)
        throw (0, error_1.createError)({ statusCode: 401, message: "unauthorized" });
    const userRecord = await (0, utils_1.getUserById)(user.id);
    const { type, phoneNumber } = body;
    otplib_1.authenticator.options = { window: 2 };
    const secret = otplib_1.authenticator.generateSecret();
    switch (type) {
        case "SMS":
            return await handleSms2FA(userRecord, secret, phoneNumber);
        case "APP":
            return await handleApp2FA(userRecord, secret);
        case "EMAIL":
            return await handleEmail2FA(userRecord, secret);
        default:
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Invalid type or 2FA method not enabled",
            });
    }
};
// Handle SMS 2FA
async function handleSms2FA(user, secret, phoneNumber) {
    if (process.env.NEXT_PUBLIC_2FA_SMS_STATUS !== "true") {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "SMS 2FA is not enabled",
        });
    }
    if (!process.env.APP_TWILIO_VERIFY_SERVICE_SID) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Service SID is not set",
        });
    }
    if (!phoneNumber) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Phone number is required for SMS",
        });
    }
    if (!phoneNumber.startsWith("+")) {
        phoneNumber = phoneNumber;
    }
    try {
        await savePhoneQuery(user.id, phoneNumber);
    }
    catch (error) {
        throw (0, error_1.createError)({ statusCode: 500, message: error.message });
    }
    const otp = otplib_1.authenticator.generate(secret);
    try {
        const twilio = (await Promise.resolve().then(() => __importStar(require("twilio")))).default;
        const twilioClient = twilio(constants_1.APP_TWILIO_ACCOUNT_SID, constants_1.APP_TWILIO_AUTH_TOKEN);
        await twilioClient.messages.create({
            body: `Your OTP code is: ${otp}`,
            from: process.env.APP_TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
    }
    catch (error) {
        console.error("Error sending SMS OTP", error);
        throw (0, error_1.createError)({ statusCode: 500, message: error.message });
    }
    return { secret };
}
// Handle APP 2FA
async function handleApp2FA(user, secret) {
    if (process.env.NEXT_PUBLIC_2FA_APP_STATUS !== "true") {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "App 2FA is not enabled",
        });
    }
    if (!user.email) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Email is required for APP OTP",
        });
    }
    const otpAuth = otplib_1.authenticator.keyuri(user.email, constants_1.appName, secret);
    const qrCode = await qrcode_1.default.toDataURL(otpAuth);
    return { secret, qrCode };
}
// Handle Email 2FA
async function handleEmail2FA(user, secret) {
    if (process.env.NEXT_PUBLIC_2FA_EMAIL_STATUS !== "true") {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Email 2FA is not enabled",
        });
    }
    const email = user.email;
    const otp = otplib_1.authenticator.generate(secret);
    try {
        await emails_1.emailQueue.add({
            emailData: {
                TO: email,
                FIRSTNAME: user.firstName,
                TOKEN: otp,
            },
            emailType: "OTPTokenVerification",
        });
    }
    catch (error) {
        throw (0, error_1.createError)({ statusCode: 500, message: error.message });
    }
    return { secret };
}
// Save phone number to database
async function savePhoneQuery(userId, phone) {
    return await db_1.models.user.update({ phone }, { where: { id: userId } });
}
