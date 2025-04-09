"use strict";
// /api/admin/authors/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Author",
    operationId: "storeAuthor",
    tags: ["Admin", "Content", "Author"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.authorUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.authorStoreSchema, "Author"),
    requiresAuth: true,
    permission: "Access Author Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, status } = body;
    return await (0, query_1.storeRecord)({
        model: "author",
        data: {
            userId,
            status,
        },
    });
};
