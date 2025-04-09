"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of P2P Escrows",
    operationId: "bulkUpdateP2pEscrowStatus",
    tags: ["Admin", "P2P Escrows"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of P2P Escrow IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            description: "New status to apply to the P2P Escrows",
                            enum: ["PENDING", "HELD", "RELEASED", "CANCELLED"],
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Escrow"),
    requiresAuth: true,
    permission: "Access P2P Escrow Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    return (0, query_1.updateStatus)("p2pEscrow", ids, status);
};
