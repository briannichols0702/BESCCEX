"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific author",
    operationId: "deleteAuthor",
    tags: ["Admin", "Content", "Author"],
    parameters: (0, query_1.deleteRecordParams)("Author"),
    responses: (0, query_1.deleteRecordResponses)("Author"),
    permission: "Access Author Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "author",
        id: params.id,
        query,
    });
};
