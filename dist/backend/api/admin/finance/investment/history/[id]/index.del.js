"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific investment",
    operationId: "deleteInvestment",
    tags: ["Admin", "General", "Investments"],
    parameters: (0, query_1.deleteRecordParams)("investment"),
    responses: (0, query_1.deleteRecordResponses)("investment"),
    permission: "Access Investment Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "investment",
        id: params.id,
        query,
    });
};
