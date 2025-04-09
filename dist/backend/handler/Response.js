"use strict";
// File: handler/Response.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const zlib_1 = __importDefault(require("zlib"));
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("@b/utils/logger"));
const isProd = process.env.NODE_ENV === "production";
class Response {
    constructor(res) {
        this.res = res;
        this.aborted = false;
        this.res.onAborted(() => {
            this.aborted = true;
        });
    }
    isAborted() {
        return this.aborted;
    }
    handleError(code, message) {
        const errorMsg = typeof message === "string" ? message : String(message);
        this.res.cork(() => {
            this.res
                .writeStatus(`${code} ${(0, utils_1.getStatusMessage)(code)}`)
                .end(JSON.stringify({ message: errorMsg }));
        });
    }
    pause() {
        return this.res.pause();
    }
    resume() {
        return this.res.resume();
    }
    writeStatus(status) {
        return this.res.writeStatus(status);
    }
    writeHeader(key, value) {
        return this.res.writeHeader(key, value);
    }
    write(chunk) {
        return this.res.write(chunk);
    }
    endWithoutBody(reportedContentLength, closeConnection) {
        return this.res.endWithoutBody(reportedContentLength, closeConnection);
    }
    tryEnd(fullBodyOrChunk, totalSize) {
        return this.res.tryEnd(fullBodyOrChunk, totalSize);
    }
    close() {
        return this.res.close();
    }
    getWriteOffset() {
        return this.res.getWriteOffset();
    }
    onWritable(handler) {
        return this.res.onWritable(handler);
    }
    onAborted(handler) {
        return this.res.onAborted(handler);
    }
    onData(handler) {
        return this.res.onData(handler);
    }
    getRemoteAddress() {
        return this.res.getRemoteAddress();
    }
    getRemoteAddressAsText() {
        return this.res.getRemoteAddressAsText();
    }
    getProxiedRemoteAddress() {
        return this.res.getProxiedRemoteAddress();
    }
    getProxiedRemoteAddressAsText() {
        return this.res.getProxiedRemoteAddressAsText();
    }
    cork(cb) {
        return this.res.cork(cb);
    }
    status(statusCode) {
        const message = (0, utils_1.getStatusMessage)(statusCode);
        this.writeStatus(`${statusCode} ${message}`);
        return this;
    }
    upgrade(userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context) {
        return this.res.upgrade(userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context);
    }
    end(body, closeConnection) {
        return this.res.end(body, closeConnection);
    }
    json(data) {
        this.res
            .writeHeader("Content-Type", "application/json")
            .end(JSON.stringify(data));
    }
    pipe(stream) {
        return this.res.pipe(stream);
    }
    setSecureCookie(name, value, options) {
        const cookieValue = `${name}=${value}; Path=/; HttpOnly=${options.httpOnly}; Secure=${options.secure}; SameSite=${options.sameSite};`;
        this.writeHeader("Set-Cookie", cookieValue);
    }
    setSecureCookies({ accessToken, csrfToken, sessionId }, request) {
        const secure = isProd;
        this.setSecureCookie("accessToken", accessToken, {
            httpOnly: true,
            secure,
            sameSite: "None",
        });
        this.setSecureCookie("csrfToken", csrfToken, {
            httpOnly: false,
            secure,
            sameSite: "Strict",
        });
        this.setSecureCookie("sessionId", sessionId, {
            httpOnly: true,
            secure,
            sameSite: "None",
        });
        this.applyUpdatedCookies(request);
    }
    applyUpdatedCookies(request) {
        const cookiesToUpdate = ["accessToken", "csrfToken", "sessionId"];
        cookiesToUpdate.forEach((cookieName) => {
            if (request.updatedCookies[cookieName]) {
                const { value } = request.updatedCookies[cookieName];
                if (request.headers.platform === "app") {
                    return this.writeHeader(cookieName, value);
                }
                let cookieValue = `${cookieName}=${value}; Path=/; HttpOnly;`;
                const expiration = (0, utils_1.getCommonExpiration)(cookieName);
                if (expiration) {
                    cookieValue += ` Expires=${expiration};`;
                }
                if (process.env.NODE_ENV === "production") {
                    cookieValue += " Secure; SameSite=None;";
                }
                this.writeHeader("Set-Cookie", cookieValue);
            }
        });
    }
    writeCommonHeaders() {
        const headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        };
        Object.entries(headers).forEach(([key, value]) => {
            this.res.writeHeader(key, value);
        });
    }
    deleteSecureCookies() {
        ["accessToken", "csrfToken", "sessionId"].forEach((cookieName) => {
            this.writeHeader("Set-Cookie", `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
        });
    }
    async sendResponse(req, statusCode, responseData) {
        if (this.aborted) {
            return;
        }
        try {
            this.res.cork(() => {
                const response = this.compressResponse(req, responseData);
                this.handleCookiesInResponse(req, Number(statusCode), responseData);
                this.writeCommonHeaders();
                this.res.writeStatus(`${statusCode} ${(0, utils_1.getStatusMessage)(Number(statusCode))}`);
                this.res.writeHeader("Content-Type", "application/json");
                this.res.end(response);
            });
        }
        catch (error) {
            (0, logger_1.default)("error", "response", __filename, `Error sending response: ${error.message}`);
            if (!this.aborted) {
                this.res.cork(() => {
                    this.res.writeStatus("500").end(error.message);
                });
            }
        }
    }
    handleCookiesInResponse(req, statusCode, responseData) {
        if ((responseData === null || responseData === void 0 ? void 0 : responseData.cookies) && [200, 201].includes(statusCode)) {
            Object.entries(responseData.cookies).forEach(([name, value]) => {
                req.updateCookie(name, value);
            });
            delete responseData.cookies;
        }
        if (req.url.startsWith("/api/auth")) {
            this.applyUpdatedCookies(req);
        }
    }
    compressResponse(req, responseData) {
        const acceptEncoding = req.headers["accept-encoding"] || "";
        let rawData;
        try {
            rawData = Buffer.from(JSON.stringify(responseData !== null && responseData !== void 0 ? responseData : {}));
        }
        catch (_a) {
            rawData = Buffer.from(JSON.stringify({}));
        }
        const sizeThreshold = 1024;
        if (rawData.length < sizeThreshold) {
            this.res.writeHeader("Content-Encoding", "identity");
            return rawData;
        }
        let contentEncoding = "identity";
        try {
            if (acceptEncoding.includes("gzip")) {
                rawData = zlib_1.default.gzipSync(rawData);
                contentEncoding = "gzip";
            }
            else if (acceptEncoding.includes("br") &&
                typeof zlib_1.default.brotliCompressSync === "function") {
                rawData = zlib_1.default.brotliCompressSync(rawData);
                contentEncoding = "br";
            }
            else if (acceptEncoding.includes("deflate")) {
                rawData = zlib_1.default.deflateSync(rawData);
                contentEncoding = "deflate";
            }
        }
        catch (compressionError) {
            // If compression fails, fall back to identity
            (0, logger_1.default)("warn", "response", __filename, `Compression error: ${compressionError.message}`);
            rawData = Buffer.from(JSON.stringify(responseData !== null && responseData !== void 0 ? responseData : {}));
            contentEncoding = "identity";
        }
        this.res.writeHeader("Content-Encoding", contentEncoding);
        return rawData;
    }
}
exports.Response = Response;
