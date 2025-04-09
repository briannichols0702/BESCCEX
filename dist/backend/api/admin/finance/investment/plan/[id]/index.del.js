"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes an investment plan",
    operationId: "deleteInvestmentPlan",
    tags: ["Admin", "Investment Plan"],
    parameters: (0, query_1.deleteRecordParams)("investment plan"),
    responses: (0, query_1.deleteRecordResponses)("Investment plan"),
    permission: "Access Investment Plan Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "investmentPlan",
        id: params.id,
        query,
    });
};
