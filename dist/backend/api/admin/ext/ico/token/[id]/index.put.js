"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ICO Token",
    operationId: "updateIcoToken",
    tags: ["Admin", "ICO Tokens"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the ICO Token to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ICO Token",
        content: {
            "application/json": {
                schema: utils_1.icoTokenUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("ICO Token"),
    requiresAuth: true,
    permission: "Access ICO Token Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, chain, currency, purchaseCurrency, purchaseWalletType, address, totalSupply, description, image, status, projectId, } = body;
    return await (0, query_1.updateRecord)("icoToken", id, {
        name,
        chain: chain.toUpperCase(),
        currency: currency.toUpperCase(),
        purchaseCurrency: purchaseCurrency.toUpperCase(),
        purchaseWalletType,
        address,
        totalSupply,
        description,
        image,
        status,
        projectId,
    });
};
