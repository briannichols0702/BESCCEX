"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMediaWatcher = exports.filterMediaCache = exports.publicDirectory = exports.mediaDirectory = exports.cacheInitialized = exports.mediaCache = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const sharp_1 = __importDefault(require("sharp"));
exports.mediaCache = [];
exports.cacheInitialized = false;
exports.mediaDirectory = (0, path_1.join)(process.cwd(), "public", "uploads");
exports.publicDirectory = (0, path_1.join)(process.cwd(), "public");
function filterMediaCache(imagePath) {
    exports.mediaCache = exports.mediaCache.filter((file) => file.id !== imagePath);
}
exports.filterMediaCache = filterMediaCache;
async function updateMediaCache(directory) {
    const fileList = [];
    async function readMediaFiles(dir) {
        const files = await fs_1.promises.readdir(dir, { withFileTypes: true });
        for (const file of files) {
            const filePath = (0, path_1.join)(dir, file.name);
            if (file.isDirectory()) {
                await readMediaFiles(filePath);
            }
            else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
                // Only read dimensions for image files
                try {
                    const { mtime } = await fs_1.promises.stat(filePath);
                    let webPath = filePath
                        .substring(exports.mediaDirectory.length)
                        .replace(/\\/g, "/");
                    if (!webPath.startsWith("/"))
                        webPath = "/" + webPath;
                    const image = (0, sharp_1.default)(filePath);
                    const metadata = await image.metadata();
                    fileList.push({
                        id: "/uploads" + webPath.replace(/\//g, "_"),
                        name: file.name,
                        path: "/uploads" + webPath,
                        width: metadata.width,
                        height: metadata.height,
                        dateModified: mtime,
                    });
                }
                catch (error) {
                    console.error(`Error accessing file: ${filePath}`, error);
                }
            }
        }
    }
    await readMediaFiles(directory);
    exports.mediaCache = fileList;
    exports.cacheInitialized = true;
}
// Initialize cache and set up watcher
async function initMediaWatcher() {
    await updateMediaCache(exports.mediaDirectory);
    (0, fs_1.watch)(exports.mediaDirectory, { recursive: true }, async (eventType, filename) => {
        await updateMediaCache(exports.mediaDirectory);
    });
}
exports.initMediaWatcher = initMediaWatcher;
