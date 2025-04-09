"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific P2P commission",
    operationId: "deleteP2PCommission",
    tags: ["Admin", "P2P", "Commissions"],
    parameters: (0, query_1.deleteRecordParams)("P2P commission"),
    responses: (0, query_1.deleteRecordResponses)("P2P commission"),
    permission: "Access P2P Commission Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "p2pCommission",
        id: params.id,
        query,
    });
};
