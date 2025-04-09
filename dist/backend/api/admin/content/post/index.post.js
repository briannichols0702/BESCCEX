"use strict";
// /api/posts/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Blog Post",
    operationId: "storePost",
    tags: ["Admin", "Content", "Posts"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.postUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.postStoreSchema, "Blog Post"),
    requiresAuth: true,
    permission: "Access Post Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { title, content, categoryId, authorId, slug, description, status, image, } = body;
    return await (0, query_1.storeRecord)({
        model: "post",
        data: {
            title,
            content,
            categoryId,
            authorId,
            slug,
            description,
            status,
            image,
        },
    });
};
