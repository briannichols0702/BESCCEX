"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Forex signal",
    operationId: "deleteForexSignal",
    tags: ["Admin", "Forex", "Signals"],
    parameters: (0, query_1.deleteRecordParams)("Forex signal"),
    responses: (0, query_1.deleteRecordResponses)("Forex signal"),
    permission: "Access Forex Signal Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "forexSignal",
        id: params.id,
        query,
    });
};
