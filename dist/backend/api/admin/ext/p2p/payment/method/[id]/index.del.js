"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific P2P payment method",
    operationId: "deleteP2PPaymentMethod",
    tags: ["Admin", "P2P Payment Methods"],
    parameters: (0, query_1.deleteRecordParams)("P2P payment method"),
    responses: (0, query_1.deleteRecordResponses)("P2P payment method"),
    permission: "Access P2P Payment Method Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "p2pPaymentMethod",
        id: params.id,
        query,
    });
};
