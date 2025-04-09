"use strict";
// /server/api/p2p/commissions/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes P2P commissions by IDs",
    operationId: "bulkDeleteP2PCommissions",
    tags: ["Admin", "P2P", "Commissions"],
    parameters: (0, query_1.commonBulkDeleteParams)("P2P Commissions"),
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
                            description: "Array of P2P commission IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("P2P Commissions"),
    requiresAuth: true,
    permission: "Access P2P Commission Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "p2pCommission",
        ids,
        query,
    });
};
