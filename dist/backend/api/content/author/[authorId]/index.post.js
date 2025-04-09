"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/blog/posts/create.post.ts
const utils_1 = require("@b/utils");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Creates a new blog post",
    description: "This endpoint creates a new blog post.",
    operationId: "createPost",
    tags: ["Content", "Author", "Post"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "authorId",
            in: "path",
            description: "ID of the author",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "New blog post data",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Title of the post" },
                        content: { type: "string", description: "Content of the post" },
                        description: {
                            type: "string",
                            description: "Description of the post",
                        },
                        categoryId: {
                            type: "string",
                            description: "Category ID for the post",
                        },
                        status: {
                            type: "string",
                            description: "Status of the blog post",
                            enum: ["PUBLISHED", "DRAFT"],
                        },
                        tags: {
                            type: "array",
                            description: "Array of tag names associated with the post",
                            items: {
                                type: "string",
                            },
                        },
                        slug: { type: "string", description: "Slug of the post" },
                    },
                    required: ["title", "content", "categoryId", "status", "slug"],
                },
            },
        },
    },
    responses: {
        201: {
            description: "Blog post created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Confirmation message of successful post creation",
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, user must be authenticated",
        },
        409: {
            description: "Conflict, post with the same slug already exists",
        },
        500: {
            description: "Internal server error",
        },
    },
};
exports.default = async (data) => {
    const { params, body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { content, tags, categoryId, description, title, status, slug, image } = body;
    const { authorId } = params;
    return await db_1.sequelize
        .transaction(async (transaction) => {
        // Check if a post with the same slug already exists
        const existingPost = await db_1.models.post.findOne({
            where: { slug, authorId },
            transaction,
        });
        if (existingPost) {
            throw (0, error_1.createError)({
                statusCode: 409,
                message: "A post with the same slug already exists",
            });
        }
        // Create the new post
        const newPost = await db_1.models.post.create({
            title,
            content,
            description,
            status,
            slug,
            authorId,
            categoryId,
            image,
        }, { transaction });
        // Add tags if provided
        if (tags) {
            await addTags(newPost, tags, transaction);
        }
        return {
            message: "Post created successfully",
        };
    })
        .catch((error) => {
        throw error; // Rethrow error to handle it, e.g., send a response to the client
    });
};
async function addTags(newPost, tags, transaction) {
    const tagInstances = [];
    for (const tagName of tags) {
        const tagSlug = (0, utils_1.slugify)(tagName.toLowerCase());
        // Check if the tag exists by slug
        let tag = await db_1.models.tag.findOne({
            where: { slug: tagSlug },
            transaction,
        });
        if (!tag) {
            tag = await db_1.models.tag.create({
                name: tagName,
                slug: tagSlug,
            }, { transaction });
        }
        tagInstances.push(tag);
    }
    // Associate the tags with the post
    await db_1.models.postTag.bulkCreate(tagInstances.map((tag) => ({
        postId: newPost.id,
        tagId: tag.id,
    })), { transaction });
}
