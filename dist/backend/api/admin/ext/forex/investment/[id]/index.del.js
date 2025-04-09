"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Forex investment",
    operationId: "deleteForexInvestment",
    tags: ["Admin", "Forex", "Investments"],
    parameters: (0, query_1.deleteRecordParams)("Forex investment"),
    responses: (0, query_1.deleteRecordResponses)("Forex investment"),
    permission: "Access Forex Investment Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "forexInvestment",
        id: params.id,
        query,
    });
};
