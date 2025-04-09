"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/admin/system/utils");
exports.metadata = {
    summary: "Checks for updates for a product",
    operationId: "checkProductUpdate",
    tags: ["Admin", "System"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        productId: {
                            type: "string",
                            description: "Product ID to check for updates",
                        },
                        currentVersion: {
                            type: "string",
                            description: "Current version of the product",
                        },
                    },
                    required: ["productId", "currentVersion"],
                },
            },
        },
    },
    permission: "Access System Update Management",
    responses: {
        200: {
            description: "Update check completed successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            updateAvailable: {
                                type: "boolean",
                                description: "Indicates if an update is available",
                            },
                            latestVersion: {
                                type: "string",
                                description: "Latest version of the product",
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, admin permission required",
        },
        500: {
            description: "Internal server error",
        },
    },
    // requiresAuth: true,
};
exports.default = async (data) => {
    return (0, utils_1.checkUpdate)(data.body.productId, data.body.currentVersion);
};
