"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific category",
    operationId: "deleteCategory",
    tags: ["Admin", "Content", "Category"],
    parameters: (0, query_1.deleteRecordParams)("Category"),
    responses: (0, query_1.deleteRecordResponses)("Category"),
    permission: "Access Category Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "category",
        id: params.id,
        query,
    });
};
