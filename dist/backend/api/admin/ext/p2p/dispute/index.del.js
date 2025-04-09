"use strict";
// /server/api/p2p/disputes/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes P2P disputes by IDs",
    operationId: "bulkDeleteP2PDisputes",
    tags: ["Admin", "P2P", "Disputes"],
    parameters: (0, query_1.commonBulkDeleteParams)("P2P Disputes"),
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
                            description: "Array of P2P dispute IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("P2P Disputes"),
    requiresAuth: true,
    permission: "Access P2P Dispute Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "p2pDispute",
        ids,
        query,
    });
};
