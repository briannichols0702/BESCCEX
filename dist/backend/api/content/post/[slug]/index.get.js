"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPost = exports.metadata = void 0;
// /server/api/blog/posts/show.get.ts
const db_1 = require("@b/db");
// import { redis } from '@b/utils/redis';
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Retrieves a single blog post by ID",
    description: "This endpoint retrieves a single blog post by its ID.",
    operationId: "getPostById",
    tags: ["Blog"],
    requiresAuth: false,
    parameters: [
        {
            index: 0,
            name: "slug",
            in: "path",
            description: "The ID of the blog post to retrieve",
            required: true,
            schema: {
                type: "string",
                description: "Post ID",
            },
        },
    ],
    responses: {
        200: {
            description: "Blog post retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.basePostSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Post"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params } = data;
    const { slug } = params;
    return await getPost(slug);
};
async function getPost(slug) {
    const post = await db_1.models.post.findOne({
        where: { slug },
        include: [
            {
                model: db_1.models.author,
                as: "author",
                include: [
                    {
                        model: db_1.models.user,
                        as: "user",
                        attributes: ["firstName", "lastName", "email", "avatar"],
                        include: [
                            {
                                model: db_1.models.role,
                                as: "role",
                                attributes: ["name"],
                            },
                        ],
                    },
                ],
            },
            {
                model: db_1.models.category,
                as: "category",
            },
            {
                model: db_1.models.tag,
                as: "tags",
                through: {
                    attributes: [],
                },
            },
            {
                model: db_1.models.comment,
                as: "comments",
                attributes: ["id", "content", "createdAt"],
                include: [
                    {
                        model: db_1.models.user,
                        as: "user",
                        attributes: ["firstName", "lastName", "email", "avatar"],
                    },
                ],
            },
        ],
    });
    if (!post) {
        return null; // If the post is not found, return null
    }
    // Fetch related articles (e.g., articles in the same category or with the same tags)
    const relatedArticles = await db_1.models.post.findAll({
        where: {
            id: {
                [sequelize_1.Op.ne]: post.id, // Exclude the current post
            },
            categoryId: post.categoryId, // Match the category
        },
        limit: 5, // Limit to 5 related articles
        order: [["createdAt", "DESC"]], // Order by recent articles
        attributes: ["id", "title", "slug", "image", "createdAt"],
        include: [
            {
                model: db_1.models.author,
                as: "author",
                include: [
                    {
                        model: db_1.models.user,
                        as: "user",
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
        ],
    });
    return {
        ...post.toJSON(),
        relatedArticles,
    };
}
exports.getPost = getPost;
