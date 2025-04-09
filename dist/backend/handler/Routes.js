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
exports.setupApiRoutes = exports.routeCache = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const Middleware_1 = require("../handler/Middleware");
const Websocket_1 = require("./Websocket");
const validation_1 = require("@b/utils/validation");
const constants_1 = require("@b/utils/constants");
const logger_1 = require("@b/utils/logger");
const fileExtension = constants_1.isProduction ? ".js" : ".ts";
exports.routeCache = new Map();
async function setupApiRoutes(app, startPath, basePath = "/api") {
    const entries = await promises_1.default.readdir(startPath, { withFileTypes: true });
    const sortedEntries = entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory())
            return 1;
        if (!a.isDirectory() && b.isDirectory())
            return -1;
        if (a.isDirectory() && b.isDirectory()) {
            const aHasBrackets = a.name.includes("[");
            const bHasBrackets = b.name.includes("[");
            if (aHasBrackets && !bHasBrackets)
                return 1;
            if (!aHasBrackets && bHasBrackets)
                return -1;
        }
        return 0;
    });
    for (const entry of sortedEntries) {
        const entryPath = (0, validation_1.sanitizePath)(path_1.default.join(startPath, entry.name));
        if ((entry.isDirectory() && entry.name === "util") ||
            entry.name === `queries${fileExtension}` ||
            entry.name === `utils${fileExtension}` ||
            entry.name.includes(".test")) {
            continue;
        }
        if (entry.isDirectory()) {
            await setupApiRoutes(app, entryPath, `${basePath}/${entry.name.replace(/\[(\w+)\]/, ":$1")}`);
            continue;
        }
        const [fileName, method] = entry.name.split(".");
        let routePath = basePath + (fileName !== "index" ? `/${fileName}` : "");
        routePath = routePath
            .replace(/\[(\w+)\]/g, ":$1")
            .replace(/\.get|\.post|\.put|\.delete|\.del|\.ws/, "");
        if (typeof app[method] === "function") {
            if (method === "ws") {
                (0, Websocket_1.handleWsMethod)(app, routePath, entryPath);
            }
            else {
                handleHttpMethod(app, method, routePath, entryPath);
            }
        }
    }
}
exports.setupApiRoutes = setupApiRoutes;
async function handleHttpMethod(app, method, routePath, entryPath) {
    app[method](routePath, async (res, req) => {
        const startTime = Date.now();
        let metadata, handler;
        const cached = exports.routeCache.get(entryPath);
        if (cached) {
            handler = cached.handler;
            metadata = cached.metadata;
            req.setMetadata(metadata);
        }
        else {
            try {
                const handlerModule = await Promise.resolve(`${entryPath}`).then(s => __importStar(require(s)));
                handler = handlerModule.default;
                if (!handler) {
                    throw new Error(`Handler not found for ${entryPath}`);
                }
                metadata = handlerModule.metadata;
                if (!metadata) {
                    throw new Error(`Metadata not found for ${entryPath}`);
                }
                req.setMetadata(metadata);
                exports.routeCache.set(entryPath, { handler, metadata });
            }
            catch (error) {
                (0, logger_1.logError)("route", error, entryPath);
                res.handleError(500, error.message);
                return;
            }
        }
        if (typeof handler !== "function") {
            throw new Error(`Handler is not a function for ${entryPath}`);
        }
        try {
            await req.parseBody();
        }
        catch (error) {
            (0, logger_1.logError)("route", error, entryPath);
            res.handleError(400, `Invalid request body: ${error.message}`);
            return;
        }
        const endBenchmarking = () => {
            const duration = Date.now() - startTime;
            let color = "\x1b[0m";
            let label = "FAST";
            if (duration > 1000) {
                color = "\x1b[41m";
                label = "VERY SLOW";
            }
            else if (duration > 500) {
                color = "\x1b[31m";
                label = "SLOW";
            }
            else if (duration > 200) {
                color = "\x1b[33m";
                label = "MODERATE";
            }
            else if (duration > 100) {
                color = "\x1b[32m";
                label = "GOOD";
            }
            else if (duration > 50) {
                color = "\x1b[36m";
                label = "FAST";
            }
            else if (duration > 10) {
                color = "\x1b[34m";
                label = "VERY FAST";
            }
            else {
                color = "\x1b[35m";
                label = "EXCELLENT";
            }
            console.log(`${color}[${label}] Request to ${routePath} (${method.toUpperCase()}) - Duration: ${duration}ms\x1b[0m`);
        };
        if (metadata.requiresApi) {
            await (0, Middleware_1.handleApiVerification)(res, req, async () => {
                await handleRequest(res, req, handler, entryPath);
                endBenchmarking();
            });
            return;
        }
        if (!metadata.requiresAuth) {
            await handleRequest(res, req, handler, entryPath);
            endBenchmarking();
            return;
        }
        await (0, Middleware_1.rateLimit)(res, req, async () => {
            await (0, Middleware_1.authenticate)(res, req, async () => {
                await (0, Middleware_1.rolesGate)(app, res, req, routePath, method, async () => {
                    await (0, Middleware_1.siteMaintenanceAccessGate)(app, res, req, async () => {
                        await handleRequest(res, req, handler, entryPath);
                        endBenchmarking();
                    });
                });
            });
        });
    });
}
async function handleRequest(res, req, handler, entryPath) {
    try {
        const result = await handler(req);
        res.sendResponse(req, 200, result);
    }
    catch (error) {
        (0, logger_1.logError)("route", error, entryPath);
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        res.handleError(statusCode, message);
    }
}
