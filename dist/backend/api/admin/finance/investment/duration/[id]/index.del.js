"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Investment duration",
    operationId: "deleteInvestmentDuration",
    tags: ["Admin", "Investment", "Durations"],
    parameters: (0, query_1.deleteRecordParams)("Investment duration"),
    responses: (0, query_1.deleteRecordResponses)("Investment duration"),
    permission: "Access Investment Duration Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "investmentDuration",
        id: params.id,
        query,
    });
};
