"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific private ledger entry",
    operationId: "updateEcosystemPrivateLedger",
    tags: ["Admin", "Ecosystem", "Private Ledgers"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the private ledger to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the private ledger entry",
        content: {
            "application/json": {
                schema: utils_1.privateLedgerUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Private Ledger"),
    requiresAuth: true,
    permission: "Access Ecosystem Private Ledger Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { index, currency, chain, network, offchainDifference } = body;
    return await (0, query_1.updateRecord)("ecosystemPrivateLedger", id, {
        index,
        currency,
        chain,
        network,
        offchainDifference,
    });
};
