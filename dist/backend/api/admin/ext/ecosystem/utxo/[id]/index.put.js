"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ecosystem UTXO",
    operationId: "updateEcosystemUtxo",
    tags: ["Admin", "Ecosystem", "UTXOs"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the UTXO to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the UTXO",
        content: {
            "application/json": {
                schema: utils_1.ecosystemUtxoUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecosystem UTXO"),
    requiresAuth: true,
    permission: "Access Ecosystem UTXO Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { walletId, transactionId, index, amount, script, status } = body;
    return await (0, query_1.updateRecord)("ecosystemUtxo", id, {
        walletId,
        transactionId,
        index,
        amount,
        script,
        status,
    });
};
