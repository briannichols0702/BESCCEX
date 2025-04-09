"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/admin/system/utils");
exports.metadata = {
    summary: "Downloads an update for a product",
    operationId: "downloadProductUpdate",
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
                            description: "Product ID to download update for",
                        },
                        updateId: {
                            type: "string",
                            description: "Update ID to download",
                        },
                        version: {
                            type: "string",
                            description: "Version of the update",
                        },
                        product: {
                            type: "string",
                            description: "Name of the product",
                        },
                        type: {
                            type: "string",
                            description: "Type of the update",
                            // Removed optional: true as it's not part of the SchemaObject definition
                        },
                    },
                    required: ["productId", "updateId", "version", "product"],
                    // 'type' is not listed as required since it's optional
                },
            },
        },
    },
    permission: "Access System Update Management",
    responses: {
        200: {
            description: "Update downloaded successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Confirmation message indicating successful download",
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
            description: "Internal server error or update download failed",
        },
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { body } = data;
    const { productId, updateId, version, product, type } = body;
    return (0, utils_1.downloadUpdate)(productId, updateId, version, product, type);
};
