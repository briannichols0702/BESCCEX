"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTag = exports.metadata = void 0;
// /server/api/blog/tags/store.post.ts
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new blog tag",
    description: "This endpoint creates a new blog tag.",
    operationId: "createTag",
    tags: ["Blog"],
    requiresAuth: true,
    requestBody: {
        description: "Data for creating a new tag",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        tag: {
                            type: "string",
                            description: "Name of the tag to create",
                        },
                    },
                    required: ["tag"],
                },
            },
        },
        required: true,
    },
    responses: (0, query_1.createRecordResponses)("Tag"),
};
exports.default = async (data) => {
    return createTag(data.body.tag);
};
async function createTag(data) {
    await db_1.models.tag.create(data);
    return {
        message: "Tag created successfully",
    };
}
exports.createTag = createTag;
