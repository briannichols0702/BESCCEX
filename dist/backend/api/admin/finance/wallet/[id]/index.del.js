"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a wallet",
    operationId: "deleteWallet",
    tags: ["Admin", "Wallet"],
    parameters: (0, query_1.deleteRecordParams)("wallet"),
    responses: (0, query_1.deleteRecordResponses)("Wallet"),
    requiresAuth: true,
    permission: "Access Wallet Management",
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "wallet",
        id: params.id,
        query,
    });
};
