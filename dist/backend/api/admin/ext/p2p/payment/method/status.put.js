"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of P2P Payment Methods",
    operationId: "bulkUpdateP2pPaymentMethodStatus",
    tags: ["Admin", "P2P Payment Methods"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of P2P Payment Method IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "boolean",
                            description: "New status to apply to the P2P Payment Methods",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Payment Method"),
    requiresAuth: true,
    permission: "Access P2P Payment Method Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    return (0, query_1.updateStatus)("p2pPaymentMethod", ids, status);
};
