"use strict";
// /api/admin/ico/tokens/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new ICO Token",
    operationId: "storeIcoToken",
    tags: ["Admin", "ICO Tokens"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.icoTokenUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.icoTokenStoreSchema, "ICO Token"),
    requiresAuth: true,
    permission: "Access ICO Token Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, chain, currency, purchaseCurrency, purchaseWalletType, address, totalSupply, description, image, status, projectId, } = body;
    return await (0, query_1.storeRecord)({
        model: "icoToken",
        data: {
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
        },
    });
};
