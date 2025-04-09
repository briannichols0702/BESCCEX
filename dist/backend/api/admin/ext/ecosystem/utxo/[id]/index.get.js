"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific ecosystem UTXO by ID",
    operationId: "getEcosystemUtxoById",
    tags: ["Admin", "Ecosystem UTXOs"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the ecosystem UTXO to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Ecosystem UTXO details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseEcosystemUtxoSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem UTXO"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Ecosystem UTXO Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("ecosystemUtxo", params.id, [
        {
            model: db_1.models.wallet,
            as: "wallet",
            attributes: ["currency"],
        },
    ]);
};
