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
exports.setupSwaggerRoute = void 0;
const constants_1 = require("@b/utils/constants");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mime_1 = require("./utils/mime");
const SWAGGER_DOC_PATH = path_1.default.join(process.cwd(), "public", "swagger.json");
const SWAGGER_UI_FOLDER = path_1.default.join(process.cwd(), "packages", "docs-ui");
const REGENERATION_INTERVAL = 300000; // 5 minutes in milliseconds
const swaggerDoc = {
    openapi: "3.0.0",
    info: {
        title: process.env.SITE_NAME || "API Documentation",
        version: "1.0.0",
        description: process.env.SITE_DESCRIPTION ||
            "This is the API documentation for the site, powered by Mash Server.",
    },
    paths: {},
    components: {
        schemas: {},
        responses: {},
        parameters: {},
        requestBodies: {},
        securitySchemes: {
            ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-KEY" },
        },
    },
    tags: [],
};
let lastSwaggerGenerationTime = 0;
async function fileExists(filePath) {
    try {
        await promises_1.default.access(filePath);
        return true;
    }
    catch (_a) {
        return false;
    }
}
async function generateSwaggerDocIfNeeded() {
    const needsRegeneration = !(await fileExists(SWAGGER_DOC_PATH)) ||
        Date.now() - lastSwaggerGenerationTime > REGENERATION_INTERVAL;
    if (needsRegeneration) {
        console.log("Swagger documentation needs regeneration.");
        await generateSwaggerDoc(path_1.default.join(constants_1.baseUrl, "api"), "/api");
        lastSwaggerGenerationTime = Date.now();
        console.log("Swagger documentation regenerated.");
    }
    else {
        console.log("Using existing Swagger documentation.");
    }
}
async function generateSwaggerDoc(startPath, basePath = "/api") {
    const entries = await promises_1.default.readdir(startPath, { withFileTypes: true });
    for (const entry of entries) {
        const entryPath = path_1.default.join(startPath, entry.name);
        if (entry.isDirectory() && ["cron", "admin", "util"].includes(entry.name)) {
            continue;
        }
        if (entry.name.startsWith("index.ws")) {
            continue;
        }
        if (entry.isDirectory()) {
            await generateSwaggerDoc(entryPath, `${basePath}/${entry.name}`);
        }
        else {
            const [routeName, method] = entry.name.replace(/\.[jt]s$/, "").split(".");
            if (!method)
                continue;
            const metadata = await loadRouteMetadata(entryPath);
            let routePath = `${basePath}/${routeName}`.replace(/\/index$/, "");
            routePath = convertToSwaggerPath(routePath);
            if (!swaggerDoc.paths[routePath]) {
                swaggerDoc.paths[routePath] = {};
            }
            swaggerDoc.paths[routePath][method.toLowerCase()] = {
                ...metadata,
                responses: constructResponses(metadata.responses),
                security: metadata.requiresAuth ? [{ ApiKeyAuth: [] }] : [],
            };
        }
    }
    const outputPath = path_1.default.join(process.cwd(), "public", "swagger.json");
    await promises_1.default.writeFile(outputPath, JSON.stringify(swaggerDoc, null, 2), "utf8");
}
async function loadRouteMetadata(entryPath) {
    try {
        const importedModule = await Promise.resolve(`${entryPath}`).then(s => __importStar(require(s)));
        if (!importedModule.metadata || !importedModule.metadata.responses) {
            console.error(`No proper 'metadata' exported from ${entryPath}`);
            return { responses: {} }; // Return a safe default to prevent errors
        }
        return importedModule.metadata;
    }
    catch (error) {
        console.error(`Error loading route metadata from ${entryPath}:`, error);
        return { responses: {} }; // Return a safe default to prevent errors
    }
}
function constructResponses(responses) {
    return Object.keys(responses).reduce((acc, statusCode) => {
        acc[statusCode] = {
            description: responses[statusCode].description,
            content: responses[statusCode].content,
        };
        return acc;
    }, {});
}
function convertToSwaggerPath(routePath) {
    // Convert :param to {param} for Swagger documentation
    routePath = routePath.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
    // Convert [param] to {param} for Swagger documentation
    routePath = routePath.replace(/\[(\w+)]/g, "{$1}");
    return routePath;
}
function setupSwaggerRoute(app) {
    app.get("/api/docs/swagger.json", async (res) => {
        try {
            await generateSwaggerDocIfNeeded();
            const data = await promises_1.default.readFile(SWAGGER_DOC_PATH);
            res.cork(() => {
                res.writeHeader("Content-Type", "application/json").end(data);
            });
        }
        catch (error) {
            console.error("Error generating or serving Swagger JSON:", error);
            res.cork(() => {
                res
                    .writeStatus("500 Internal Server Error")
                    .end("Internal Server Error");
            });
        }
    });
    app.get("/api/docs/*", async (res, req) => {
        try {
            const urlPath = req.getUrl();
            const filePath = urlPath === "/api/docs/v1"
                ? "index.html"
                : urlPath.replace("/api/docs/", "");
            const fullPath = path_1.default.join(SWAGGER_UI_FOLDER, filePath);
            const data = await promises_1.default.readFile(fullPath);
            res.cork(() => {
                res.writeHeader("Content-Type", (0, mime_1.getMime)(filePath)).end(data);
            });
        }
        catch (error) {
            console.error("Error serving Swagger UI:", error);
            res.cork(() => {
                res
                    .writeStatus("500 Internal Server Error")
                    .end("Internal Server Error");
            });
        }
    });
}
exports.setupSwaggerRoute = setupSwaggerRoute;
