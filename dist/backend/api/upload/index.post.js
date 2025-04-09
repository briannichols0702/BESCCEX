"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const query_1 = require("@b/utils/query");
const validation_1 = require("@b/utils/validation");
const rootPath = process.cwd();
const BASE_UPLOAD_DIR = path_1.default.join(rootPath, "public", "uploads");
exports.metadata = {
    summary: "Uploads a file to a specified directory",
    description: "Uploads a file to a specified directory",
    operationId: "uploadFile",
    tags: ["Upload"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        dir: {
                            type: "string",
                            description: "Directory to upload file to",
                        },
                        file: {
                            type: "string",
                            description: "Base64 encoded file data",
                        },
                        height: {
                            type: "number",
                            description: "Height of the image",
                        },
                        width: {
                            type: "number",
                            description: "Width of the image",
                        },
                        oldPath: {
                            type: "string",
                            description: "Path of the old image to remove",
                        },
                    },
                    required: ["dir", "file"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "File uploaded successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            url: {
                                type: "string",
                                description: "URL of the uploaded file",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Upload"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    var _a;
    const { body, user } = data;
    if (!user)
        throw new Error("User not found");
    const { dir, file: base64File, width, height, oldPath } = body;
    if (!dir || !base64File) {
        throw new Error("No directory specified or no file provided");
    }
    // Sanitize the directory path to prevent LFI
    const sanitizedDir = (0, validation_1.sanitizePath)(dir.replace(/-/g, "/"));
    const base64Data = base64File.split(",")[1];
    const mimeType = ((_a = base64File.match(/^data:(.*);base64,/)) === null || _a === void 0 ? void 0 : _a[1]) || "";
    const mediaDir = path_1.default.join(BASE_UPLOAD_DIR, sanitizedDir);
    await ensureDirExists(mediaDir);
    const buffer = Buffer.from(base64Data, "base64");
    let filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    let processedImage = buffer;
    // Check if the MIME type starts with 'image/' and is not a GIF
    if (mimeType.startsWith("image/") && !mimeType.includes("image/gif")) {
        processedImage = await (0, sharp_1.default)(buffer)
            .resize({ width, height, fit: "inside" }) // Resize image
            .webp({ quality: 80 }) // Convert to WebP
            .toBuffer();
        filename += ".webp";
    }
    else if (mimeType.startsWith("video/")) {
        // For video files, simply use the original format and skip processing
        filename += mimeType.split("/")[1]; // Use original video extension
    }
    else if (mimeType.includes("image/gif")) {
        // Keep GIFs unprocessed to preserve animations
        filename += ".gif";
    }
    else {
        throw new Error("Unsupported file format.");
    }
    const filePath = path_1.default.join(mediaDir, filename);
    await promises_1.default.writeFile(filePath, processedImage);
    if (oldPath) {
        try {
            await removeOldImageIfAvatar(oldPath);
        }
        catch (error) {
            console.error("Error removing old image:", error);
        }
    }
    return { url: `/uploads/${sanitizedDir.replace(/\\/g, "/")}/${filename}` };
};
async function ensureDirExists(dir) {
    try {
        await promises_1.default.access(dir);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await promises_1.default.mkdir(dir, { recursive: true });
        }
        else {
            throw error;
        }
    }
}
async function removeOldImageIfAvatar(oldPath) {
    if (oldPath) {
        const oldImageFullPath = path_1.default.join(rootPath, "public", oldPath);
        try {
            await promises_1.default.access(oldImageFullPath);
            await promises_1.default.unlink(oldImageFullPath);
        }
        catch (error) {
            console.error("Error removing old image:", error);
        }
    }
}
