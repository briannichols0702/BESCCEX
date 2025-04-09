"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Forex account",
    operationId: "deleteForexAccount",
    tags: ["Admin", "Forex"],
    parameters: (0, query_1.deleteRecordParams)("Forex account"),
    responses: (0, query_1.deleteRecordResponses)("Forex account"),
    permission: "Access Forex Account Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "forexAccount",
        id: params.id,
        query,
    });
};
