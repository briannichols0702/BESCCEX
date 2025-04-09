"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of ecosystem custodial wallets",
    operationId: "bulkUpdateEcosystemCustodialWalletStatus",
    tags: ["Admin", "Ecosystem Custodial Wallets"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of ecosystem custodial wallet IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
                            description: "New status to apply to the ecosystem custodial wallets",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecosystem Custodial Wallet"),
    requiresAuth: true,
    permission: "Access Ecosystem Custodial Wallet Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    return (0, query_1.updateStatus)("ecosystemCustodialWallet", ids, status);
};
