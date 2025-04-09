"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadData = exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("@b/db");
const rootPath = process.cwd();
const dataFolder = "data";
exports.metadata = {
    summary: "Handles editor related requests",
    description: "This endpoint handles various editor-related requests, including data, asset, and theme handling.",
    operationId: "handleEditor",
    tags: ["Builder"],
    parameters: [
        {
            in: "query",
            name: "type",
            schema: {
                type: "string",
                enum: ["data", "asset", "theme"],
            },
            required: true,
            description: "The type of request to handle",
        },
        {
            in: "query",
            name: "path",
            schema: {
                type: "string",
            },
            description: "The path to the file to load",
        },
        {
            in: "query",
            name: "ext",
            schema: {
                type: "string",
            },
            description: "The file extension to load",
        },
        {
            in: "query",
            name: "name",
            schema: {
                type: "string",
            },
            description: "The name of the theme to load",
        },
    ],
    responses: {
        200: {
            description: "Request handled successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: { type: "string", description: "Response data" },
                            urls: {
                                type: "array",
                                items: { type: "string" },
                                description: "Uploaded file URLs",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Resource"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Frontend Builder",
};
exports.default = async (data) => {
    const { query } = data;
    const { type, path, ext, name } = query;
    switch (type) {
        case "all":
            return await loadAllData(query);
        case "data":
            let page = await db_1.models.page.findOne({
                where: { slug: path === "/" ? "frontend" : path },
            });
            if (!page) {
                page = await db_1.models.page.create({
                    title: "Frontend",
                    slug: "frontend",
                    content: "{}",
                    status: "PUBLISHED",
                    order: 0,
                });
            }
            return page.content;
        case "theme":
            return await loadTheme(query);
        default:
            return { data: "Invalid request" };
    }
};
const loadData = async (route, ext) => {
    const fileName = getFileNameFromRoute(route);
    const dataPath = path_1.default.join(rootPath, dataFolder, `${fileName}.${ext}`);
    if (!fs_1.default.existsSync(dataPath)) {
        return ext === "json" ? "{}" : "<div>Not found</div>";
    }
    else {
        const data = await fs_1.default.promises.readFile(dataPath, "utf8");
        return data;
    }
};
exports.loadData = loadData;
// Helper functions
const getFileNameFromRoute = (route) => route === "/" ? "frontend" : route;
const loadAllData = async (query) => {
    const { name } = query;
    const basePath = path_1.default.join(rootPath, dataFolder);
    const files = readdirRecursive(basePath);
    const data = await Promise.all(files.map((f) => fs_1.default.promises
        .readFile(f, "utf8")
        .then((c) => ({ name: f, content: c }))
        .then((c) => fixPaths(c, basePath))));
    return data;
};
const readdirRecursive = (folder, files = []) => {
    fs_1.default.readdirSync(folder).forEach((file) => {
        const pathAbsolute = path_1.default.join(folder, file);
        if (fs_1.default.statSync(pathAbsolute).isDirectory()) {
            readdirRecursive(pathAbsolute, files);
        }
        else {
            files.push(pathAbsolute);
        }
    });
    return files;
};
const fixPaths = (c, basePath) => {
    const nameWithoutBasePath = getRouteFromFilename(c.name.replace(basePath, ""));
    const nameWithFixSeps = nameWithoutBasePath.split(path_1.default.sep).join("/"); // replace all
    return { content: c.content, name: nameWithFixSeps };
};
const getRouteFromFilename = (filename) => filename.slice(0, -5) === path_1.default.sep + "default" ? path_1.default.sep : filename; // file paths are OS-specific
const loadTheme = async (query) => {
    const { name } = query;
    // handle request
    const themeName = query.name;
    const folderPath = path_1.default.join(process.cwd(), "themes", themeName);
    const componentNames = await fs_1.default.promises
        .readdir(folderPath)
        .then((f) => f.filter((c) => c !== "index.ts" && !c.startsWith(".")));
    const componentsP = componentNames.map(async (c) => {
        const assetPath = path_1.default.join(folderPath, c, "index.html");
        const source = await fs_1.default.promises.readFile(assetPath, "utf-8");
        return { source, folder: c };
    });
    const components = await Promise.all(componentsP);
    return components;
};
