"use strict";
// /api/p2p/offers/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new P2P Offer",
    operationId: "storeP2POffer",
    tags: ["Admin", "P2P", "Offers"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.p2pOfferUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.p2pOfferStoreSchema, "P2P Offer"),
    requiresAuth: true,
    permission: "Access P2P Offer Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, walletType, currency, chain, amount, minAmount, maxAmount, inOrder, price, paymentMethodId, status, } = body;
    return await (0, query_1.storeRecord)({
        model: "p2pOffer",
        data: {
            userId,
            walletType,
            currency,
            chain,
            amount,
            minAmount,
            maxAmount,
            inOrder,
            price,
            paymentMethodId,
            status,
        },
    });
};
