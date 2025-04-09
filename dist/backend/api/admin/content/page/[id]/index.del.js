"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a page",
    operationId: "deletePage",
    tags: ["Admin", "Content", "Page"],
    parameters: (0, query_1.deleteRecordParams)("page"),
    responses: (0, query_1.deleteRecordResponses)("Page"),
    permission: "Access Page Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "page",
        id: params.id,
        query,
    });
};
