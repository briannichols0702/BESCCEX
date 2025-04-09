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
const error_1 = require("@b/utils/error");
const otplib_1 = require("otplib");
const emails_1 = require("@b/utils/emails");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Resends the OTP for 2FA",
    operationId: "resendOtp",
    tags: ["Auth"],
    description: "Resends the OTP for 2FA",
    requiresAuth: false,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            description: "ID of the user",
                        },
                        type: {
                            type: "string",
                            enum: ["EMAIL", "SMS"],
                            description: "Type of 2FA",
                        },
                    },
                    required: ["id", "type"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP resent successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
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
    const { body } = data;
    const { id, type } = body;
    const user = await (0, utils_1.getUserWith2FA)(id);
    const otp = generateOtp(user.twoFactor.secret);
    if (type === "SMS") {
        await handleSmsResend(user.phone, otp);
    }
    else if (type === "EMAIL") {
        await handleEmailResend(user.email, user.firstName, otp);
    }
    else {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Invalid 2FA type or 2FA method not enabled",
        });
    }
    return {
        message: "OTP resent successfully",
    };
};
// Generate OTP
function generateOtp(secret) {
    otplib_1.authenticator.options = { window: 2 };
    return otplib_1.authenticator.generate(secret);
}
// Handle SMS OTP resend
async function handleSmsResend(phoneNumber, otp) {
    if (process.env.NEXT_PUBLIC_2FA_SMS_STATUS !== "true" ||
        !process.env.APP_TWILIO_VERIFY_SERVICE_SID) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "SMS 2FA is not enabled",
        });
    }
    const twilio = (await Promise.resolve().then(() => __importStar(require("twilio")))).default;
    try {
        const twilioClient = twilio(constants_1.APP_TWILIO_ACCOUNT_SID, constants_1.APP_TWILIO_AUTH_TOKEN);
        await twilioClient.messages.create({
            body: `Your OTP code is: ${otp}`,
            from: process.env.APP_TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: phoneNumber,
        });
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Error sending SMS: ${error.message}`,
        });
    }
}
// Handle email OTP resend
async function handleEmailResend(email, firstName, otp) {
    if (process.env.NEXT_PUBLIC_2FA_EMAIL_STATUS !== "true") {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Email 2FA is not enabled",
        });
    }
    try {
        await emails_1.emailQueue.add({
            emailData: {
                TO: email,
                FIRSTNAME: firstName,
                TOKEN: otp,
            },
            emailType: "OTPTokenVerification",
        });
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Error sending email: ${error.message}`,
        });
    }
}
