"use strict";
// /api/p2p/paymentMethods/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new P2P Payment Method",
    operationId: "storeP2PPaymentMethod",
    tags: ["Admin", "P2P", "Payment Methods"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.p2pPaymentMethodUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.p2pPaymentMethodStoreSchema, "P2P Payment Method"),
    requiresAuth: true,
    permission: "Access P2P Payment Method Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, name, instructions, walletType, chain, currency, image, status, } = body;
    return await (0, query_1.storeRecord)({
        model: "p2pPaymentMethod",
        data: {
            userId,
            name,
            instructions,
            walletType,
            chain,
            currency,
            image,
            status,
        },
    });
};
