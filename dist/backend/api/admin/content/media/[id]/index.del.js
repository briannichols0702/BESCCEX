"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("../utils");
const validation_1 = require("@b/utils/validation");
exports.metadata = {
    summary: "Deletes an image file by id",
    operationId: "deleteImageFile",
    tags: ["Admin", "Content", "Media"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "The relative id of the image file to delete",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Image file deleted successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        400: { description: "Bad request if the id is not specified" },
        404: { description: "Not found if the image file does not exist" },
        500: { description: "Internal server error" },
    },
    requiresAuth: true,
    permission: "Access Media Management",
};
exports.default = async (data) => {
    const { params } = data;
    const imagePath = params.id;
    if (!imagePath) {
        throw new Error("Image id is required");
    }
    // Sanitize the image path to prevent LFI
    const sanitizedPath = (0, validation_1.sanitizePath)(imagePath.replace(/_/g, path_1.sep));
    const fullPath = (0, path_1.join)(utils_1.publicDirectory, sanitizedPath);
    try {
        await fs_1.promises.unlink(fullPath);
        (0, utils_1.filterMediaCache)(sanitizedPath);
        return { message: "Image file deleted successfully" };
    }
    catch (error) {
        if (error.code === "ENOENT") {
            throw new Error("Image file not found");
        }
        else if (error.code === "EBUSY") {
            throw new Error("File is busy or locked");
        }
        else {
            throw new Error("Failed to delete image file");
        }
    }
};
