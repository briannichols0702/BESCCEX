"use strict";
// /server/api/admin/binary/orders/index.delete.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a binary order",
    operationId: "deleteBinaryOrder",
    tags: ["Admin", "Binary Order"],
    parameters: (0, query_1.deleteRecordParams)("binary order"),
    responses: (0, query_1.deleteRecordResponses)("Binary Order"),
    requiresAuth: true,
    permission: "Access Binary Order Management",
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "binaryOrder",
        id: params.id,
        query,
    });
};
