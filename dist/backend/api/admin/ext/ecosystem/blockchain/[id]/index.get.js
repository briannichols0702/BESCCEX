"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/admin/system/utils");
exports.metadata = {
    summary: "Retrieves details of a specific product by name",
    operationId: "getBlockchainDetails",
    tags: ["Admin", "System"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "Id of the product to retrieve",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    // permission: "Access System Update Management",
    responses: {
        200: {
            description: "Product details retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "ID of the product",
                            },
                            name: {
                                type: "string",
                                description: "Name of the product",
                            },
                            title: {
                                type: "string",
                                description: "Title of the product",
                            },
                            description: {
                                type: "string",
                                description: "Description of the product",
                            },
                            version: {
                                type: "string",
                                description: "Version of the product",
                            },
                            image: {
                                type: "string",
                                description: "Image of the product",
                            },
                            status: {
                                type: "boolean",
                                description: "Status of the product",
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, admin permission required",
        },
        404: {
            description: "Product not found",
        },
        500: {
            description: "Internal server error",
        },
    },
    // requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return (0, utils_1.getBlockchain)(params.id);
};
