"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific post",
    operationId: "deletePost",
    tags: ["Admin", "Content", "Posts"],
    parameters: (0, query_1.deleteRecordParams)("Post"),
    responses: (0, query_1.deleteRecordResponses)("Post"),
    permission: "Access Post Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "post",
        id: params.id,
        query,
    });
};
