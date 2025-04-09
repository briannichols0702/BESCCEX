"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific comment",
    operationId: "deleteComment",
    tags: ["Admin", "Content", "Comment"],
    parameters: (0, query_1.deleteRecordParams)("Comment"),
    responses: (0, query_1.deleteRecordResponses)("Comment"),
    permission: "Access Comment Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "comment",
        id: params.id,
        query,
    });
};
