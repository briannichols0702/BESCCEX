"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.metadata = void 0;
// /server/api/blog/categories/delete.del.ts
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a blog category",
    description: "This endpoint deletes a blog category.",
    operationId: "deleteCategory",
    tags: ["Blog"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the category to delete",
            required: true,
            schema: {
                type: "string",
                description: "Category ID",
            },
        },
    ],
    responses: (0, query_1.deleteRecordResponses)("Category"),
};
exports.default = async (data) => {
    return deleteCategory(data.params.id);
};
async function deleteCategory(id) {
    return await db_1.models.category.destroy({
        where: { id },
    });
}
exports.deleteCategory = deleteCategory;
