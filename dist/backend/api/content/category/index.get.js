"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/blog/categories/index.get.ts
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all categories with optional inclusion of posts",
    description: "This endpoint retrieves all available categories along with their associated posts.",
    operationId: "getCategories",
    tags: ["Blog"],
    requiresAuth: false,
    responses: {
        200: {
            description: "Categories retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                ...utils_1.baseCategorySchema,
                                posts: utils_1.categoryPostsSchema,
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Category"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    return (await db_1.models.category.findAll({
        include: [
            {
                model: db_1.models.post,
                as: "posts",
                attributes: ["title", "description", "slug", "image", "createdAt"],
                where: { status: "PUBLISHED" },
                required: false,
                include: [
                    {
                        model: db_1.models.author,
                        as: "author",
                        attributes: ["id"],
                        include: [
                            {
                                model: db_1.models.user,
                                as: "user",
                                attributes: ["firstName", "lastName", "email", "avatar"],
                            },
                        ],
                    },
                ],
            },
        ],
    })).map((category) => category.get({ plain: true }));
};
