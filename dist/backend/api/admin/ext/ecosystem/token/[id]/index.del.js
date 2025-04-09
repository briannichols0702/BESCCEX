"use strict";
// /server/api/ecosystem/tokens/delete/[id].del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes an ecosystem token",
    operationId: "deleteEcosystemToken",
    tags: ["Admin", "Ecosystem", "Tokens"],
    parameters: (0, query_1.deleteRecordParams)("ecosystem token"),
    responses: (0, query_1.deleteRecordResponses)("Ecosystem token"),
    requiresAuth: true,
    permission: "Access Ecosystem Token Management",
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "ecosystemToken",
        id: params.id,
        query,
    });
};
