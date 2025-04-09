"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const uWebSockets_js_1 = require("uWebSockets.js");
const url_1 = __importDefault(require("url"));
const utils_1 = require("../utils");
const validation_1 = require("../utils/validation");
const error_1 = require("@b/utils/error");
const logger_1 = __importDefault(require("@b/utils/logger"));
const ip_1 = __importDefault(require("ip"));
class Request {
    constructor(res, req) {
        this.res = res;
        this.req = req;
        this.keys = [];
        this.params = {};
        this.cookies = {};
        this.headers = {};
        this.user = null;
        this.connection = {
            encrypted: false,
            remoteAddress: "127.0.0.1",
        };
        this.updatedCookies = {};
        this.url = req.getUrl();
        this.method = req.getMethod();
        this.query = this.parseQuery();
        this.headers = this.parseHeaders();
        this.cookies = this.parseCookies();
        // Capture the remote address (IP) of the user
        const remoteAddressBuffer = this.res.getRemoteAddressAsText();
        const rawAddress = remoteAddressBuffer
            ? Buffer.from(remoteAddressBuffer).toString("utf-8")
            : "127.0.0.1"; // Default to localhost if unavailable
        // Handle IPv6 loopback explicitly and convert to IPv4
        this.remoteAddress =
            rawAddress === "::1" ||
                rawAddress === "0000:0000:0000:0000:0000:0000:0000:0001"
                ? "127.0.0.1"
                : ip_1.default.isV6Format(rawAddress)
                    ? ip_1.default.toString(ip_1.default.toBuffer(rawAddress))
                    : rawAddress;
        if (this.metadata) {
            this.validateParameters();
        }
    }
    parseHeaders() {
        const headers = {};
        this.req.forEach((key, value) => {
            headers[key] = value;
        });
        return headers;
    }
    parseCookies() {
        const cookiesHeader = this.headers["cookie"] || "";
        const cookies = {};
        cookiesHeader
            .split(";")
            .map((c) => c.trim())
            .forEach((cookie) => {
            const eqIndex = cookie.indexOf("=");
            if (eqIndex > -1) {
                const name = cookie.substring(0, eqIndex).trim();
                const val = cookie.substring(eqIndex + 1).trim();
                cookies[name] = val;
            }
        });
        return cookies;
    }
    parseQuery() {
        return url_1.default.parse(`?${this.req.getQuery()}`, true).query;
    }
    async parseBody() {
        var _a, _b;
        try {
            if (!["post", "put", "patch", "delete"].includes(this.method.toLowerCase()))
                return;
        }
        catch (error) {
            (0, logger_1.default)("error", "request", __filename, `Error in parseBody: ${error.message}`);
            throw (0, error_1.createError)({ statusCode: 500, message: "Internal Server Error" });
        }
        const contentType = this.headers["content-type"] || "";
        try {
            const bodyContent = await this.readRequestBody();
            this.body = this.processBodyContent(contentType, bodyContent);
            if (((_a = this.metadata) === null || _a === void 0 ? void 0 : _a.requestBody) &&
                ((_b = this.metadata.requestBody.content[contentType]) === null || _b === void 0 ? void 0 : _b.schema)) {
                this.body = (0, validation_1.validateSchema)(this.body, this.metadata.requestBody.content[contentType].schema);
            }
        }
        catch (error) {
            (0, logger_1.default)("error", "request", __filename, `Error processing body content: ${error.message}`);
            throw (0, error_1.createError)({ statusCode: 400, message: error.message });
        }
    }
    async readRequestBody() {
        const bodyData = [];
        return new Promise((resolve, reject) => {
            let hadData = false;
            this.res.onData((ab, isLast) => {
                hadData = true;
                const chunk = Buffer.from(ab).toString();
                bodyData.push(chunk);
                if (isLast) {
                    resolve(bodyData.join(""));
                }
            });
            this.res.onAborted(() => {
                if (!hadData) {
                    resolve("");
                }
                else {
                    reject(new Error("Request aborted"));
                }
            });
        });
    }
    processBodyContent(contentType, bodyContent) {
        const trimmedBody = bodyContent.trim();
        if (contentType.includes("application/json") && trimmedBody !== "") {
            try {
                return JSON.parse(trimmedBody);
            }
            catch (error) {
                throw new Error(`Invalid JSON: ${error.message}`);
            }
        }
        else if (contentType.includes("application/x-www-form-urlencoded")) {
            return Object.fromEntries(new URLSearchParams(trimmedBody));
        }
        // Handle unknown content-type gracefully
        return trimmedBody || {};
    }
    validateParameters() {
        if (!this.metadata || !this.metadata.parameters)
            return;
        for (const parameter of this.metadata.parameters) {
            const value = this.getParameterValue(parameter);
            if (value === undefined && parameter.required) {
                throw new Error(`Missing required ${parameter.in} parameter: "${parameter.name}"`);
            }
            if (value !== undefined) {
                try {
                    this.updateParameterValue(parameter, (0, validation_1.validateSchema)(value, parameter.schema));
                }
                catch (error) {
                    throw new Error(`Validation error for ${parameter.in} parameter "${parameter.name}": ${error.message}`);
                }
            }
        }
    }
    getParameterValue(parameter) {
        switch (parameter.in) {
            case "query":
                return this.query[parameter.name];
            case "header":
                return this.headers[parameter.name];
            case "path":
                return this.params[parameter.name];
            case "cookie":
                return this.cookies[parameter.name];
            default:
                return undefined;
        }
    }
    updateParameterValue(parameter, value) {
        switch (parameter.in) {
            case "query":
                this.query[parameter.name] = value;
                break;
            case "path":
                this.params[parameter.name] = value;
                break;
            case "cookie":
                this.cookies[parameter.name] = value;
                break;
        }
    }
    _setRegexparam(keys, regExp) {
        this.keys = keys;
        this.regExp = regExp;
    }
    getHeader(lowerCaseKey) {
        return this.req.getHeader(lowerCaseKey);
    }
    getParameter(index) {
        return this.req.getParameter(index);
    }
    getUrl() {
        return this.req.getUrl();
    }
    getMethod() {
        return this.req.getMethod();
    }
    getCaseSensitiveMethod() {
        return this.req.getCaseSensitiveMethod();
    }
    getQuery() {
        return this.req.getQuery();
    }
    setYield(_yield) {
        return this.req.setYield(_yield);
    }
    extractPathParameters() {
        if (!this.regExp)
            return;
        const matches = this.regExp.exec(this.url);
        if (!matches)
            return;
        this.keys.forEach((key, index) => {
            const value = matches[index + 1];
            if (value !== undefined) {
                this.params[key] = decodeURIComponent(value);
            }
        });
    }
    async rawBody() {
        return new Promise(async (resolve, reject) => {
            this.res.onData((data) => resolve((0, utils_1.handleArrayBuffer)(data)));
            this.res.onAborted(() => reject(null));
        });
    }
    async file() {
        const header = this.req.getHeader("content-type");
        return await new Promise((resolve, reject) => {
            let buffer = Buffer.from("");
            this.res.onData((ab, isLast) => {
                buffer = Buffer.concat([buffer, Buffer.from(ab)]);
                if (isLast) {
                    resolve((0, uWebSockets_js_1.getParts)(buffer, header));
                }
            });
            this.res.onAborted(() => reject(null));
        });
    }
    updateCookie(name, value, options = {}) {
        this.updatedCookies[name] = { value, options };
    }
    updateTokens(tokens) {
        Object.entries(tokens).forEach(([name, value]) => {
            this.updatedCookies[name] = { value };
        });
    }
    setMetadata(metadata) {
        this.metadata = metadata;
    }
    getMetadata() {
        return this.metadata;
    }
    setUser(user) {
        this.user = user;
    }
    getUser() {
        return this.user;
    }
}
exports.Request = Request;
