"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const heic_convert_1 = __importDefault(require("heic-convert"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const validation_1 = require("@b/utils/validation");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Converts a HEIC image to JPEG format",
    description: "Converts a HEIC image to JPEG format and returns the file URL",
    operationId: "convertHeicFile",
    tags: ["Conversion"],
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
                            description: "Directory to save the converted file",
                        },
                        file: {
                            type: "string",
                            description: "Base64 encoded HEIC file data",
                        },
                        mimeType: { type: "string", description: "MIME type of the file" }, // Added mimeType
                    },
                    required: ["dir", "file", "mimeType"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "File converted successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            url: { type: "string", description: "URL of the converted file" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Conversion"),
        500: query_1.serverErrorResponse,
    },
};
const BASE_CONVERT_DIR = path_1.default.join(process.cwd(), "public", "converted");
exports.default = async (data) => {
    const { body, user } = data;
    if (!user)
        throw new Error("User not found");
    const { dir, file: base64File, mimeType } = body;
    if (!dir || !base64File || !mimeType) {
        throw new Error("Missing required fields: dir, file, or mimeType");
    }
    // Decode the base64 string to get the binary data
    const base64Data = base64File.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    // Validate the directory path and create directories if necessary
    const sanitizedDir = (0, validation_1.sanitizePath)(dir.replace(/-/g, "/"));
    const mediaDir = path_1.default.join(BASE_CONVERT_DIR, sanitizedDir);
    await ensureDirExists(mediaDir);
    // Define the output filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const outputPath = path_1.default.join(mediaDir, filename);
    // Check MIME type and ensure it's a supported HEIC format
    if (!mimeType.includes("heic") && !mimeType.includes("heif")) {
        throw new Error("Unsupported file format. Only HEIC or HEIF files are allowed.");
    }
    // Convert HEIC to JPEG using `heic-convert`
    try {
        const jpegBuffer = await (0, heic_convert_1.default)({
            buffer, // Input buffer for HEIC data
            format: "JPEG", // Output format as JPEG
            quality: 0.8, // Quality scale: 0-1 (optional, defaults to 1)
        });
        // Write the converted JPEG file to the target directory
        await promises_1.default.writeFile(outputPath, jpegBuffer);
        // Return the file URL
        return { url: `/converted/${sanitizedDir}/${filename}` };
    }
    catch (error) {
        console.error("Error converting HEIC to JPEG using `heic-convert`:", error);
        throw new Error("HEIC to JPEG conversion failed using `heic-convert`.");
    }
};
// Helper function to ensure the directory exists
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
