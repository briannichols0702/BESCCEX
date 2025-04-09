"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Update Status for a Blockchain",
    operationId: "updateBlockchainStatus",
    tags: ["Admin", "Blockchains"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Blockchain to update",
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
                            description: "New status to apply to the Blockchain (true for active, false for inactive)",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Blockchain"),
    requiresAuth: true,
    permission: "Access Blockchain Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    // Update the status of the blockchain in the database
    await db_1.models.ecosystemBlockchain.update({ status }, { where: { productId: id } });
    return { message: "Blockchain status updated successfully" };
};
