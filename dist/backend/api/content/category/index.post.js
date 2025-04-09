"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.metadata = void 0;
// /server/api/blog/categories/store.post.ts
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new blog category",
    description: "This endpoint creates a new blog category.",
    operationId: "createCategory",
    tags: ["Blog"],
    requiresAuth: true,
    requestBody: {
        required: true,
        description: "Name of the category to create",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        category: {
                            type: "string",
                            description: "Name of the category to create",
                        },
                    },
                    required: ["category"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Category"),
};
exports.default = async (data) => {
    return createCategory(data.body.category);
};
async function createCategory(data) {
    await db_1.models.category.create(data);
    return {
        message: "Category created successfully",
    };
}
exports.createCategory = createCategory;
