"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific P2P trade",
    operationId: "deleteP2PTrade",
    tags: ["Admin", "P2P", "Trades"],
    parameters: (0, query_1.deleteRecordParams)("P2P trade"),
    responses: (0, query_1.deleteRecordResponses)("P2P trade"),
    permission: "Access P2P Trade Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "p2pTrade",
        id: params.id,
        query,
    });
};
