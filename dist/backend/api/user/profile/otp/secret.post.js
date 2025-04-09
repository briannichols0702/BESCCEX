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
exports.savePhoneQuery = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const otplib_1 = require("otplib");
const qrcode_1 = __importDefault(require("qrcode"));
const query_1 = require("@b/utils/query");
const APP_TWILIO_ACCOUNT_SID = process.env.APP_TWILIO_ACCOUNT_SID;
const APP_TWILIO_AUTH_TOKEN = process.env.APP_TWILIO_AUTH_TOKEN;
const APP_TWILIO_PHONE_NUMBER = process.env.APP_TWILIO_PHONE_NUMBER;
const NEXT_PUBLIC_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
exports.metadata = {
    summary: "Generates an OTP secret and sends OTP via SMS or generates a QR code for OTP APP",
    description: "Generates an OTP secret and sends OTP via SMS or generates a QR code for OTP APP",
    operationId: "generateOTPSecret",
    tags: ["Profile"],
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
                            description: "Type of OTP to generate",
                            enum: ["SMS", "APP"],
                        },
                        phoneNumber: {
                            type: "string",
                            description: "Phone number to send the OTP to",
                        },
                        email: {
                            type: "string",
                            description: "Email to generate the QR code for OTP APP",
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
                            status: {
                                type: "boolean",
                                description: "Indicates if the request was successful",
                            },
                            statusCode: {
                                type: "number",
                                description: "HTTP status code",
                                example: 200,
                            },
                            data: {
                                type: "object",
                                properties: {
                                    secret: {
                                        type: "string",
                                        description: "OTP secret",
                                    },
                                    qrCode: {
                                        type: "string",
                                        description: "QR code for OTP APP",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("User"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    var _a;
    if (!((_a = data.user) === null || _a === void 0 ? void 0 : _a.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { type, phoneNumber, email } = data.body;
    const secret = otplib_1.authenticator.generateSecret();
    try {
        if (type === "SMS") {
            if (!phoneNumber)
                throw (0, error_1.createError)({
                    statusCode: 400,
                    message: "Phone number is required for SMS type",
                });
            await savePhoneQuery(data.user.id, phoneNumber);
            const otp = otplib_1.authenticator.generate(secret);
            const twilio = (await Promise.resolve().then(() => __importStar(require("twilio")))).default(APP_TWILIO_ACCOUNT_SID, APP_TWILIO_AUTH_TOKEN);
            await twilio.messages.create({
                body: `Your OTP is: ${otp}`,
                from: APP_TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });
            return { secret };
        }
        else {
            const otpAuth = otplib_1.authenticator.keyuri(email || "", NEXT_PUBLIC_SITE_NAME || "", secret);
            const qrCode = await qrcode_1.default.toDataURL(otpAuth);
            return { secret, qrCode };
        }
    }
    catch (error) {
        throw (0, error_1.createError)({ statusCode: 500, message: error.message });
    }
};
async function savePhoneQuery(userId, phone) {
    await db_1.models.user.update({
        phone: phone,
    }, {
        where: { id: userId },
    });
    const response = await db_1.models.user.findOne({
        where: { id: userId },
    });
    if (!response) {
        throw new Error("User not found");
    }
    return response.get({ plain: true });
}
exports.savePhoneQuery = savePhoneQuery;
