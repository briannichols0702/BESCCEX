"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific ICO project",
    operationId: "deleteIcoProject",
    tags: ["Admin", "ICO", "Projects"],
    parameters: (0, query_1.deleteRecordParams)("ICO project"),
    responses: (0, query_1.deleteRecordResponses)("ICO project"),
    permission: "Access ICO Project Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "icoProject",
        id: params.id,
        query,
    });
};
