"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.metadata = void 0;
// /server/api/blog/categories/update.put.ts
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates an existing blog category",
    description: "This endpoint updates an existing blog category.",
    operationId: "updateCategory",
    tags: ["Blog"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the category to update",
            required: true,
            schema: {
                type: "string",
                description: "Category ID",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "New name of the category",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        category: {
                            type: "string",
                            description: "New name of the category",
                        },
                    },
                    required: ["category"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Category"),
};
exports.default = async (data) => {
    return updateCategory(data.params.id, data.body.category);
};
async function updateCategory(id, data) {
    await db_1.models.category.update(data, {
        where: { id },
    });
    const updatedCategory = await db_1.models.category.findOne({
        where: { id },
    });
    if (!updatedCategory) {
        throw new Error("Category not found");
    }
    return updatedCategory;
}
exports.updateCategory = updateCategory;
