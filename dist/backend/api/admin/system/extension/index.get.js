"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Lists all comments with pagination and optional filtering by user or post",
    operationId: "listComments",
    tags: ["Admin", "Content", "Comment"],
    responses: {
        200: {
            description: "List of comments with user and post details and pagination",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string", description: "ID of the extension" },
                                productId: {
                                    type: "string",
                                    description: "Product ID of the extension",
                                },
                                name: { type: "string", description: "Name of the extension" },
                                title: {
                                    type: "string",
                                    description: "Title of the extension",
                                },
                                description: {
                                    type: "string",
                                    description: "Description of the extension",
                                },
                                link: { type: "string", description: "Link to the extension" },
                                status: {
                                    type: "boolean",
                                    description: "Status of the extension",
                                },
                                version: {
                                    type: "string",
                                    description: "Version of the extension",
                                },
                                image: {
                                    type: "string",
                                    description: "Image of the extension",
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Extensions"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Extension Management",
};
exports.default = async (data) => {
    const extensions = await db_1.models.extension.findAll({
        where: { [sequelize_1.Op.not]: { name: "swap" } },
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
    });
    return extensions;
};
