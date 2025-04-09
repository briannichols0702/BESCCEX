"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTag = exports.metadata = void 0;
// /server/api/blog/tags/update.put.ts
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates an existing blog tag",
    description: "This endpoint updates an existing blog tag.",
    operationId: "updateTag",
    tags: ["Blog"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the tag to update",
            required: true,
            schema: {
                type: "string",
                description: "Tag ID",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "New name of the tag",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        tag: { type: "string", description: "New name of the tag" },
                    },
                    required: ["tag"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Tag"),
};
exports.default = async (data) => {
    return updateTag(data.params.id, data.body.tag);
};
async function updateTag(id, data) {
    await db_1.models.tag.update(data, {
        where: { id },
    });
    const tag = await db_1.models.tag.findByPk(id);
    if (!tag) {
        throw (0, error_1.createError)(404, "Tag not found");
    }
    return {
        ...tag.get({ plain: true }),
        message: "Tag updated successfully",
    };
}
exports.updateTag = updateTag;
