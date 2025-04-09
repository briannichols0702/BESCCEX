"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific AI Investment Plan",
    operationId: "deleteAIInvestmentPlan",
    tags: ["Admin", "AI Investment Plan"],
    parameters: (0, query_1.deleteRecordParams)("AI Investment Plan"),
    responses: (0, query_1.deleteRecordResponses)("AI Investment Plan"),
    permission: "Access AI Investment Plan Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "aiInvestmentPlan",
        id: params.id,
        query,
    });
};
