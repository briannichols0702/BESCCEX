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
exports.MashServer = void 0;
// server.ts
const uWebSockets_js_1 = require("uWebSockets.js");
const RouteHandler_1 = require("./handler/RouteHandler");
const utils_1 = require("./utils");
const Routes_1 = require("@b/handler/Routes");
const docs_1 = require("@b/docs");
const utils_2 = require("@b/utils");
const roles_1 = require("@b/utils/roles");
const cron_1 = __importStar(require("@b/utils/cron"));
require("@b/db");
const client_1 = require("@b/utils/eco/scylla/client");
const matchingEngine_1 = require("@b/utils/eco/matchingEngine");
const logger_1 = __importDefault(require("@b/utils/logger"));
const Response_1 = require("./handler/Response");
const path = __importStar(require("path"));
const constants_1 = require("@b/utils/constants");
const cache_1 = require("./utils/cache");
const worker_threads_1 = require("worker_threads");
const db_1 = require("@b/db");
class MashServer extends RouteHandler_1.RouteHandler {
    constructor(options = {}) {
        super();
        this.benchmarkRoutes = [];
        this.app = (0, uWebSockets_js_1.App)(options);
        this.cors();
        this.initializeServer();
        (0, utils_1.setupProcessEventHandlers)();
    }
    listen(port, cb) {
        this.app.any("/*", (res, req) => {
            let responseSent = false;
            res.onAborted(() => {
                responseSent = true;
            });
            try {
                const url = req.getUrl();
                if (["/uploads/", "/themes/"].some((path) => url.startsWith(path))) {
                    const handled = (0, utils_1.serveStaticFile)(res, req, url, () => (responseSent = true));
                    if (handled)
                        return;
                }
                this.processRoute(res, req, () => (responseSent = true));
            }
            catch (error) {
                console.error("Server error :", error);
                if (!responseSent && !res.aborted) {
                    const response = new Response_1.Response(res);
                    response.handleError(500, `Internal Server Error: ${error.message}`);
                    responseSent = true;
                }
            }
        });
        this.app.listen(port, cb);
    }
    async initializeServer() {
        try {
            const threadType = worker_threads_1.isMainThread ? "Main Thread" : `Worker ${worker_threads_1.threadId}`;
            console.log(`\x1b[36m${threadType}: Initializing server...\x1b[0m`);
            // Ensure models are initialized
            await this.ensureDatabaseReady();
            console.log(`\x1b[36m${threadType}: Setting up roles...\x1b[0m`);
            await this.safeExecute(() => this.setupRoles(), "setupRoles");
            console.log(`\x1b[36m${threadType}: Setting up routes...\x1b[0m`);
            await this.safeExecute(() => this.setupRoutes(), "setupRoutes");
            console.log(`\x1b[36m${threadType}: Setting up cron jobs...\x1b[0m`);
            await this.safeExecute(() => this.setupCronJobs(), "setupCronJobs");
            console.log(`\x1b[36m${threadType}: Loading extensions and checking ecosystem...\x1b[0m`);
            await this.safeExecute(async () => {
                const cacheManager = cache_1.CacheManager.getInstance();
                const extensions = await cacheManager.getExtensions();
                if (extensions.has("ecosystem")) {
                    await this.setupEcosystem();
                }
            }, "setupEcosystem");
            console.log(`\x1b[32m${threadType}: Server initialized successfully\x1b[0m`); // Green for success log
        }
        catch (error) {
            console.error(`\x1b[31mError during application initialization: ${error.message}\x1b[0m`); // Red for error log
            process.exit(1);
        }
    }
    async ensureDatabaseReady() {
        return new Promise((resolve, reject) => {
            if (db_1.sequelize) {
                resolve();
            }
            else {
                reject(new Error("Sequelize instance is not initialized."));
            }
        });
    }
    // Helper method to execute async functions safely and log any errors
    async safeExecute(fn, label) {
        try {
            await fn();
        }
        catch (error) {
            (0, logger_1.default)("error", label, __filename, `${label} failed: ${error.message}`);
            throw error; // Rethrow to be handled by initializeServer's catch
        }
    }
    async setupRoles() {
        await roles_1.rolesManager.initialize();
        this.setRoles(roles_1.rolesManager.roles);
    }
    async setupRoutes() {
        (0, Routes_1.setupApiRoutes)(this, path.join(constants_1.baseUrl, "api"));
        (0, docs_1.setupSwaggerRoute)(this);
        (0, utils_2.setupDefaultRoutes)(this);
    }
    async setupCronJobs() {
        if (!worker_threads_1.isMainThread)
            return; // Only the main thread should setup cron jobs
        const cronJobManager = await cron_1.default.getInstance(); // Ensure all cron jobs are loaded
        const cronJobs = cronJobManager.getCronJobs();
        const threadType = worker_threads_1.isMainThread ? "Main Thread" : `Worker ${worker_threads_1.threadId}`;
        // Create workers for each job
        cronJobs.forEach((job) => {
            (0, cron_1.createWorker)(job.name, job.function, job.period);
            console.log(`\x1b[33m${threadType} Cron created: ${job.name}\x1b[0m`);
        });
    }
    async setupEcosystem() {
        try {
            await (0, client_1.initialize)();
            await matchingEngine_1.MatchingEngine.getInstance();
        }
        catch (error) {
            (0, logger_1.default)("error", "ecosystem", __filename, `Error initializing ecosystem: ${error.message}`);
        }
    }
    get(path, ...handler) {
        this.benchmarkRoutes.push({ method: "get", path });
        super.set("get", path, ...handler);
    }
    post(path, ...handler) {
        super.set("post", path, ...handler);
    }
    put(path, ...handler) {
        super.set("put", path, ...handler);
    }
    patch(path, ...handler) {
        super.set("patch", path, ...handler);
    }
    del(path, ...handler) {
        super.set("delete", path, ...handler);
    }
    options(path, ...handler) {
        super.set("options", path, ...handler);
    }
    head(path, ...handler) {
        super.set("head", path, ...handler);
    }
    connect(path, ...handler) {
        super.set("connect", path, ...handler);
    }
    trace(path, ...handler) {
        super.set("trace", path, ...handler);
    }
    all(path, ...handler) {
        super.set("all", path, ...handler);
    }
    getBenchmarkRoutes() {
        return this.benchmarkRoutes;
    }
    use(middleware) {
        super.use(middleware);
    }
    error(cb) {
        super.error(cb);
    }
    notFound(cb) {
        super.notFound(cb);
    }
    ws(pattern, behavior) {
        this.app.ws(pattern, behavior);
    }
    cors() {
        this.app.options("/*", (res, req) => {
            const origin = req.headers ? req.headers["origin"] : undefined;
            if (origin && utils_1.allowedOrigins.includes(origin)) {
                (0, utils_1.setCORSHeaders)(res, origin);
            }
            res.end();
        });
        this.use((res, req, next) => {
            const origin = req.headers ? req.headers["origin"] : undefined;
            if (origin && utils_1.allowedOrigins.includes(origin)) {
                (0, utils_1.setCORSHeaders)(res, origin);
            }
            if (typeof next === "function") {
                next();
            }
        });
    }
    setRoles(roles) {
        this.roles = roles;
    }
    getRole(id) {
        return this.roles.get(id);
    }
    getDescriptor() {
        // Return the descriptor of the uWS app instance
        return this.app.getDescriptor();
    }
    addChildAppDescriptor(descriptor) {
        // Add a child app descriptor to the main app
        this.app.addChildAppDescriptor(descriptor);
    }
}
exports.MashServer = MashServer;
