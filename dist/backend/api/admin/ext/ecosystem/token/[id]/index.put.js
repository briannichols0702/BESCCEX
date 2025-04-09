"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Updates a specific ecosystem token",
    operationId: "updateEcosystemToken",
    tags: ["Admin", "Ecosystem", "Tokens"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the token to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ecosystem token",
        content: {
            "application/json": {
                schema: utils_1.ecosystemTokenUpdateSchema,
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
    const { status, limits, fee, icon } = body;
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
    try {
        const updateResult = await (0, query_1.updateRecord)("ecosystemToken", id, {
            status,
            limits: JSON.stringify(limits),
            fee: JSON.stringify(fee),
            icon,
        }, true);
        if (updateResult && icon) {
            const updatedToken = await db_1.models.ecosystemToken.findByPk(id);
            if (updatedToken && updatedToken.currency) {
                try {
                    await (0, utils_1.updateIconInCache)(updatedToken.currency, icon);
                }
                catch (error) {
                    console.error(`Failed to update icon in cache for ${updatedToken.currency}:`, error);
                }
            }
        }
        return updateResult;
    }
    catch (error) {
        console.error(`Error updating ecosystem token:`, error);
        throw error;
    }
};
