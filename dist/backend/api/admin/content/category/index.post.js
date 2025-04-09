"use strict";
// /api/admin/categories/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Category",
    operationId: "storeCategory",
    tags: ["Admin", "Content", "Category"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.categoryUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.categoryStoreSchema, "Category"),
    requiresAuth: true,
    permission: "Access Category Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, slug, image, description } = body;
    return await (0, query_1.storeRecord)({
        model: "category",
        data: {
            name,
            slug,
            image,
            description,
        },
    });
};
