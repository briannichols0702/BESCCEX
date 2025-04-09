"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceTemplateVariables = exports.fetchAndProcessEmailTemplate = exports.prepareEmailTemplate = exports.emailWithNodemailerSmtp = exports.emailWithNodemailerService = exports.emailWithSendgrid = exports.sendEmailWithProvider = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const constants_1 = require("./constants");
const error_1 = require("./error");
const db_1 = require("@b/db");
const logger_1 = require("@b/utils/logger");
const cache_1 = require("@b/utils/cache");
async function sendEmailWithProvider(provider, options) {
    try {
        switch (provider) {
            case "local":
                await emailWithLocalSMTP(options);
                break;
            case "nodemailer-service":
                options.from = constants_1.APP_NODEMAILER_SERVICE_SENDER;
                await emailWithNodemailerService(constants_1.APP_NODEMAILER_SERVICE_SENDER, constants_1.APP_NODEMAILER_SERVICE_PASSWORD, constants_1.APP_NODEMAILER_SERVICE, options);
                break;
            case "nodemailer-smtp":
                options.from =
                    process.env.NEXT_PUBLIC_APP_EMAIL &&
                        process.env.NEXT_PUBLIC_APP_EMAIL !== ""
                        ? process.env.NEXT_PUBLIC_APP_EMAIL
                        : constants_1.APP_NODEMAILER_SMTP_SENDER;
                await emailWithNodemailerSmtp(constants_1.APP_NODEMAILER_SMTP_SENDER, constants_1.APP_NODEMAILER_SMTP_PASSWORD, constants_1.APP_NODEMAILER_SMTP_HOST, constants_1.APP_NODEMAILER_SMTP_PORT, constants_1.APP_NODEMAILER_SMTP_ENCRYPTION === "ssl", options);
                break;
            case "nodemailer-sendgrid":
                options.from = constants_1.APP_SENDGRID_SENDER;
                await emailWithSendgrid(options);
                break;
            default:
                throw new Error("Unsupported email provider");
        }
    }
    catch (error) {
        (0, logger_1.logError)("email", error, __filename);
        throw error;
    }
}
exports.sendEmailWithProvider = sendEmailWithProvider;
async function emailWithLocalSMTP(options) {
    try {
        const transporterOptions = {
            sendmail: true,
            newline: "unix",
            path: constants_1.APP_SENDMAIL_PATH,
        };
        const APP_NODEMAILER_DKIM_PRIVATE_KEY = process.env.APP_NODEMAILER_DKIM_PRIVATE_KEY || "";
        const APP_NODEMAILER_DKIM_DOMAIN = process.env.APP_NODEMAILER_DKIM_DOMAIN || "";
        const APP_NODEMAILER_DKIM_SELECTOR = process.env.APP_NODEMAILER_DKIM_SELECTOR || "default";
        if (APP_NODEMAILER_DKIM_PRIVATE_KEY &&
            APP_NODEMAILER_DKIM_DOMAIN &&
            APP_NODEMAILER_DKIM_SELECTOR) {
            transporterOptions.dkim = {
                privateKey: fs_1.default.readFileSync(APP_NODEMAILER_DKIM_PRIVATE_KEY, "utf8"),
                domainName: APP_NODEMAILER_DKIM_DOMAIN,
                keySelector: APP_NODEMAILER_DKIM_SELECTOR,
            };
        }
        const transporter = nodemailer_1.default.createTransport(transporterOptions);
        const mailOptions = {
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        (0, logger_1.logError)("email", error, __filename);
        throw error;
    }
}
async function emailWithSendgrid(options) {
    const apiKey = constants_1.APP_SENDGRID_API_KEY;
    if (!apiKey)
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Sendgrid Api key not found. Cannot send email. Aborting.",
        });
    try {
        mail_1.default.setApiKey(apiKey);
        const msg = {
            to: options.to,
            from: options.from,
            subject: options.subject,
            html: options.html ? options.html : options.text,
        };
        await mail_1.default.send(msg);
    }
    catch (error) {
        (0, logger_1.logError)("email", error, __filename);
        throw error;
    }
}
exports.emailWithSendgrid = emailWithSendgrid;
async function emailWithNodemailerService(sender, password, service, options) {
    const emailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };
    if (!service)
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Email service not specified. Aborting email send.",
        });
    if (!sender)
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Email user not specified. Aborting email send.",
        });
    if (!password)
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Email password not specified. Aborting email send.",
        });
    try {
        const transporter = await nodemailer_1.default.createTransport({
            service: service,
            auth: {
                user: sender,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        await transporter.verify();
        await transporter.sendMail(emailOptions);
    }
    catch (error) {
        (0, logger_1.logError)("email", error, __filename);
        throw error;
    }
}
exports.emailWithNodemailerService = emailWithNodemailerService;
async function emailWithNodemailerSmtp(sender, password, host, port, smtpEncryption, options) {
    const emailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };
    if (!host)
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Email host not specified. Aborting email send.",
        });
    if (!sender)
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Email user not specified. Aborting email send.",
        });
    if (!password)
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Email password not specified. Aborting email send.",
        });
    try {
        const transporter = await nodemailer_1.default.createTransport({
            host: host,
            port: port,
            pool: true,
            secure: false,
            auth: {
                user: sender,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        await transporter.verify();
        await transporter.sendMail(emailOptions);
    }
    catch (error) {
        (0, logger_1.logError)("email", error, __filename);
        throw error;
    }
}
exports.emailWithNodemailerSmtp = emailWithNodemailerSmtp;
async function prepareEmailTemplate(processedTemplate, processedSubject) {
    const generalTemplate = fs_1.default.readFileSync(`${process.cwd()}/template/generalTemplate.html`, "utf-8");
    if (!generalTemplate) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "General email template not found",
        });
    }
    const cacheManager = cache_1.CacheManager.getInstance();
    const settings = await cacheManager.getSettings();
    const fullLogo = settings.get("fullLogo");
    const replacements = {
        "%SITE_URL%": constants_1.NEXT_PUBLIC_SITE_URL,
        "%HEADER%": (fullLogo === null || fullLogo === void 0 ? void 0 : fullLogo.value)
            ? `<img src="${constants_1.NEXT_PUBLIC_SITE_URL}${fullLogo === null || fullLogo === void 0 ? void 0 : fullLogo.value}" style="max-height:96px;" />`
            : `<h1>${constants_1.NEXT_PUBLIC_SITE_NAME || "Bicrypto"}</h1>`,
        "%MESSAGE%": processedTemplate,
        "%SUBJECT%": processedSubject,
        "%FOOTER%": constants_1.NEXT_PUBLIC_SITE_NAME || "Bicrypto",
    };
    return Object.entries(replacements).reduce((acc, [key, value]) => replaceAllOccurrences(acc, key, value), generalTemplate);
}
exports.prepareEmailTemplate = prepareEmailTemplate;
async function fetchAndProcessEmailTemplate(specificVariables, templateName) {
    try {
        const templateRecord = await db_1.models.notificationTemplate.findOne({
            where: { name: templateName },
        });
        if (!templateRecord || !templateRecord.email || !templateRecord.emailBody)
            throw (0, error_1.createError)({
                statusCode: 404,
                message: "Email template not found or email not enabled",
            });
        const basicVariables = {
            URL: constants_1.NEXT_PUBLIC_SITE_URL,
        };
        const variables = {
            ...basicVariables,
            ...specificVariables,
        };
        const processedTemplate = replaceTemplateVariables(templateRecord.emailBody, variables);
        const processedSubject = replaceTemplateVariables(templateRecord.subject, variables);
        return { processedTemplate, processedSubject, templateRecord };
    }
    catch (error) {
        (0, logger_1.logError)("email", error, __filename);
        throw error;
    }
}
exports.fetchAndProcessEmailTemplate = fetchAndProcessEmailTemplate;
function replaceTemplateVariables(template, variables) {
    if (typeof template !== "string") {
        console.error("Template is not a string");
        return "";
    }
    return Object.entries(variables).reduce((acc, [key, value]) => {
        if (value === undefined) {
            console.warn(`Variable ${key} is undefined`);
            return acc;
        }
        return acc.replace(new RegExp(`%${key}%`, "g"), String(value));
    }, template);
}
exports.replaceTemplateVariables = replaceTemplateVariables;
function replaceAllOccurrences(str, search, replace) {
    if (str == null) {
        console.error("Input string is null or undefined");
        return "";
    }
    const regex = new RegExp(search, "g");
    return str.replace(regex, replace);
}
