"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a deposit method",
    operationId: "deleteDepositMethod",
    tags: ["Admin", "Deposit Methods"],
    parameters: (0, query_1.deleteRecordParams)("deposit method"),
    responses: (0, query_1.deleteRecordResponses)("Deposit method"),
    requiresAuth: true,
    permission: "Access Deposit Method Management",
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "depositMethod",
        id: params.id,
        query,
    });
};
