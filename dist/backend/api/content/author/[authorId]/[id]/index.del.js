"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific post",
    operationId: "deletePost",
    tags: ["Content", "Author", "Post"],
    parameters: [
        {
            index: 0,
            name: "authorId",
            in: "path",
            description: "ID of the author",
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            index: 1,
            name: "id",
            in: "path",
            description: `ID of the post to delete`,
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            name: "restore",
            in: "query",
            description: `Restore the post instead of deleting`,
            required: false,
            schema: {
                type: "boolean",
            },
        },
        {
            name: "force",
            in: "query",
            description: `Delete the post permanently`,
            required: false,
            schema: {
                type: "boolean",
            },
        },
    ],
    responses: (0, query_1.deleteRecordResponses)("Post"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { authorId } = params;
    return (0, query_1.handleSingleDelete)({
        model: "post",
        id: params.id,
        query,
        where: { authorId },
    });
};
