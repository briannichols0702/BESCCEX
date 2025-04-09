"use strict";
// /server/api/p2p/escrows/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes P2P escrows by IDs",
    operationId: "bulkDeleteP2PEscrows",
    tags: ["Admin", "P2P", "Escrows"],
    parameters: (0, query_1.commonBulkDeleteParams)("P2P Escrows"),
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of P2P escrow IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("P2P Escrows"),
    requiresAuth: true,
    permission: "Access P2P Escrow Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "p2pEscrow",
        ids,
        query,
    });
};
