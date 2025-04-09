"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific P2P escrow",
    operationId: "deleteP2PEscrow",
    tags: ["Admin", "P2P", "Escrows"],
    parameters: (0, query_1.deleteRecordParams)("P2P escrow"),
    responses: (0, query_1.deleteRecordResponses)("P2P escrow"),
    permission: "Access P2P Escrow Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "p2pEscrow",
        id: params.id,
        query,
    });
};
