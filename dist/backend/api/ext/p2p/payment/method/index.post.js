"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Stores a new P2P Payment Method",
    operationId: "storeP2PPaymentMethod",
    tags: ["P2P", "Payment Methods"],
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
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { walletType, chain, name, instructions, currency, image, status } = body;
    // Check if the user already has 5 or more payment methods
    const paymentMethodsCount = await db_1.models.p2pPaymentMethod.count({
        where: { userId: user.id },
    });
    if (paymentMethodsCount >= 5) {
        throw (0, error_1.createError)(400, "You can only have up to 5 payment methods.");
    }
    let currencyData;
    switch (walletType) {
        case "FIAT":
            currencyData = await db_1.models.currency.findOne({
                where: { id: currency, status: true },
            });
            if (!currencyData) {
                throw (0, error_1.createError)(400, "Currency not found");
            }
            break;
        case "SPOT":
            currencyData = await db_1.models.exchangeCurrency.findOne({
                where: { currency: currency, status: true },
            });
            if (!currencyData) {
                throw (0, error_1.createError)(400, "Currency not found");
            }
            break;
        case "ECO":
            currencyData = await db_1.models.ecosystemToken.findOne({
                where: { currency: currency, status: true },
            });
            if (!currencyData) {
                throw (0, error_1.createError)(400, "Currency not found");
            }
            break;
        default:
            throw (0, error_1.createError)(400, "Invalid wallet type");
    }
    return await (0, query_1.storeRecord)({
        model: "p2pPaymentMethod",
        data: {
            userId: user.id,
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
