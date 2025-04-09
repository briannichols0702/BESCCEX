"use strict";
// /api/admin/ecosystem/utxos/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Ecosystem UTXO",
    operationId: "storeEcosystemUtxo",
    tags: ["Admin", "Ecosystem UTXOs"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.ecosystemUtxoUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.ecosystemUtxoStoreSchema, "Ecosystem UTXO"),
    requiresAuth: true,
    permission: "Access Ecosystem UTXO Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { walletId, transactionId, index, amount, script, status } = body;
    return await (0, query_1.storeRecord)({
        model: "ecosystemUtxo",
        data: {
            walletId,
            transactionId,
            index,
            amount,
            script,
            status,
        },
    });
};
