"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific ICO allocation",
    operationId: "deleteIcoAllocation",
    tags: ["Admin", "ICO", "Allocations"],
    parameters: (0, query_1.deleteRecordParams)("ICO allocation"),
    responses: (0, query_1.deleteRecordResponses)("ICO allocation"),
    permission: "Access ICO Allocation Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "icoAllocation",
        id: params.id,
        query,
    });
};
