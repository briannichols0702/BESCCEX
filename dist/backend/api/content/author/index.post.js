"use strict";
// /server/api/blog/authors/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new author",
    description: "This endpoint creates a new author.",
    operationId: "createAuthor",
    tags: ["Content", "Author"],
    requiresAuth: true,
    responses: (0, query_1.createRecordResponses)("Author"),
};
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const author = await db_1.models.author.findOne({
        where: {
            userId: user.id,
        },
    });
    if (author)
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Author profile already exists",
        });
    await db_1.models.author.create({
        userId: user.id,
        status: "PENDING",
    });
    return {
        message: "Author created successfully",
    };
};
