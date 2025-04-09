"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Forex duration",
    operationId: "deleteForexDuration",
    tags: ["Admin", "Forex", "Durations"],
    parameters: (0, query_1.deleteRecordParams)("Forex duration"),
    responses: (0, query_1.deleteRecordResponses)("Forex duration"),
    permission: "Access Forex Duration Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "forexDuration",
        id: params.id,
        query,
    });
};
