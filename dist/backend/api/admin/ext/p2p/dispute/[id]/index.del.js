"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific P2P dispute",
    operationId: "deleteP2PDispute",
    tags: ["Admin", "P2P", "Disputes"],
    parameters: (0, query_1.deleteRecordParams)("P2P dispute"),
    responses: (0, query_1.deleteRecordResponses)("P2P dispute"),
    permission: "Access P2P Dispute Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "p2pDispute",
        id: params.id,
        query,
    });
};
