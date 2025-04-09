"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific API key",
    operationId: "deleteApiKey",
    tags: ["Admin", "API Keys"],
    parameters: (0, query_1.deleteRecordParams)("API Key"),
    responses: (0, query_1.deleteRecordResponses)("API Key"),
    permission: "Access API Key Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "apiKey",
        id: params.id,
        query,
    });
};
