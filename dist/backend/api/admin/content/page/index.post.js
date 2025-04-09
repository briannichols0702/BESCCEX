"use strict";
// /api/admin/pages/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores or updates a CMS page",
    operationId: "storePage",
    tags: ["Admin", "Content", "Page"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: utils_1.basePageSchema,
                    required: ["title", "content", "slug", "status"],
                },
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.pageStoreSchema, "Page"),
    requiresAuth: true,
    permission: "Access Page Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { title, content, description, image, slug, status } = body;
    return await (0, query_1.storeRecord)({
        model: "page",
        data: {
            title,
            content,
            description,
            image,
            slug,
            status,
        },
    });
};
