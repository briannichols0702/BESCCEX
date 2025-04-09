"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific AI Investment Duration",
    operationId: "deleteAIInvestmentDuration",
    tags: ["Admin", "AI Investment Duration"],
    parameters: (0, query_1.deleteRecordParams)("AI Investment Duration"),
    responses: (0, query_1.deleteRecordResponses)("AI Investment Duration"),
    permission: "Access AI Investment Duration Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "aiInvestmentDuration",
        id: params.id,
        query,
    });
};
