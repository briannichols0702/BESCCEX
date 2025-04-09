"use strict";
// /api/admin/categories/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Tag",
    operationId: "storeTag",
    tags: ["Admin", "Content", "Category"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.tagUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.tagStoreSchema, "Tag"),
    requiresAuth: true,
    permission: "Access Tag Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, slug, image, description } = body;
    return await (0, query_1.storeRecord)({
        model: "tag",
        data: {
            name,
            slug,
            image,
            description,
        },
    });
};
