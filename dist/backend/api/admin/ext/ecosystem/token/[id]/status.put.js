"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the status of an Ecosystem Token",
    operationId: "updateEcosystemTokenStatus",
    tags: ["Admin", "Tokens"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the token to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "boolean",
                            description: "New status to apply (true for active, false for inactive)",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecosystem Token"),
    requiresAuth: true,
    permission: "Access Ecosystem Token Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    const token = await db_1.models.ecosystemToken.findByPk(id);
    if (!token) {
        throw new Error(`Token with ID ${id} not found`);
    }
    const blockchain = await db_1.models.ecosystemBlockchain.findOne({
        where: { chain: token.chain },
    });
    if (blockchain && !blockchain.status) {
        if (blockchain.version === "0.0.1") {
            throw new Error(`Please install the latest version of the blockchain ${token.chain} to enable this token`);
        }
        else {
            throw new Error(`${token.chain} Blockchain is disabled`);
        }
    }
    return (0, query_1.updateStatus)("ecosystemToken", id, status);
};
