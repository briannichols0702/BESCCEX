"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Forex plan",
    operationId: "deleteForexPlan",
    tags: ["Admin", "Forex", "Plans"],
    parameters: (0, query_1.deleteRecordParams)("Forex plan"),
    responses: (0, query_1.deleteRecordResponses)("Forex plan"),
    permission: "Access Forex Plan Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "forexPlan",
        id: params.id,
        query,
    });
};
