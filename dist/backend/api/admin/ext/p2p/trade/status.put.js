"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of P2P Trades",
    operationId: "bulkUpdateP2pTradeStatus",
    tags: ["Admin", "P2P Trades"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of P2P Trade IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "PAID",
                                "DISPUTE_OPEN",
                                "ESCROW_REVIEW",
                                "CANCELLED",
                                "COMPLETED",
                                "REFUNDED",
                            ],
                            description: "New status to apply to the P2P Trades",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Trade"),
    requiresAuth: true,
    permission: "Access P2P Trade Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    return (0, query_1.updateStatus)("p2pTrade", ids, status);
};
