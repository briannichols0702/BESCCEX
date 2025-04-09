"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific tag",
    operationId: "deleteTag",
    tags: ["Admin", "Content", "Tag"],
    parameters: (0, query_1.deleteRecordParams)("Tag"),
    responses: (0, query_1.deleteRecordResponses)("Tag"),
    permission: "Access Tag Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "tag",
        id: params.id,
        query,
    });
};
