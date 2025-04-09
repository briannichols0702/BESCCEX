"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategory = exports.metadata = void 0;
// /server/api/blog/categories/show.get.ts
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves a single category by ID with optional inclusion of posts",
    description: "This endpoint retrieves a single category by its ID with optional inclusion of posts.",
    operationId: "getCategoryById",
    tags: ["Blog"],
    requiresAuth: false,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the category to retrieve",
            required: true,
            schema: {
                type: "string",
                description: "Category ID",
            },
        },
        {
            name: "posts",
            in: "query",
            description: "Include posts in the category",
            required: false,
            schema: {
                type: "boolean",
            },
        },
    ],
    responses: {
        200: {
            description: "Category retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            ...utils_1.baseCategorySchema,
                            posts: utils_1.categoryPostsSchema,
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
    return getCategory(data.params.id, data.query.posts === "true");
};
async function getCategory(id, includePosts) {
    const includes = includePosts
        ? [
            {
                model: db_1.models.post,
                as: "post",
                include: [
                    {
                        model: db_1.models.author,
                        as: "author",
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
        ]
        : [];
    return await db_1.models.category
        .findOne({
        where: { id },
        include: includes, // Pass the constructed array to the include option
    })
        .then((result) => (result ? result.get({ plain: true }) : null)); // Convert to plain object if result is not null
}
exports.getCategory = getCategory;
