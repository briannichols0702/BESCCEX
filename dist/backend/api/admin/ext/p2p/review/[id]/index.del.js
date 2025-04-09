"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific P2P review",
    operationId: "deleteP2PReview",
    tags: ["Admin", "P2P", "Reviews"],
    parameters: (0, query_1.deleteRecordParams)("P2P review"),
    responses: (0, query_1.deleteRecordResponses)("P2P review"),
    permission: "Access P2P Review Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "p2pReview",
        id: params.id,
        query,
    });
};
