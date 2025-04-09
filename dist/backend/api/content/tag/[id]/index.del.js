"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.metadata = void 0;
// /server/api/blog/tags/delete.del.ts
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a blog tag",
    description: "This endpoint deletes a blog tag.",
    operationId: "deleteTag",
    tags: ["Blog"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the tag to delete",
            required: true,
            schema: {
                type: "string",
                description: "Tag ID",
            },
        },
    ],
    responses: (0, query_1.deleteRecordResponses)("Tag"),
};
exports.default = async (data) => {
    return deleteTag(data.params.id);
};
async function deleteTag(id) {
    await db_1.models.tag.destroy({
        where: { id },
    });
    return {
        message: "Tag deleted successfully",
    };
}
exports.deleteTag = deleteTag;
