"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific ICO token",
    operationId: "deleteIcoToken",
    tags: ["Admin", "ICO", "Tokens"],
    parameters: (0, query_1.deleteRecordParams)("ICO token"),
    responses: (0, query_1.deleteRecordResponses)("ICO token"),
    permission: "Access ICO Token Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "icoToken",
        id: params.id,
        query,
    });
};
