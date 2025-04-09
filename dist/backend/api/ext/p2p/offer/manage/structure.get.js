"use strict";
// /api/p2pOffers/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pOfferStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const error_1 = require("@b/utils/error");
const cache_1 = require("@b/utils/cache");
const currency_1 = require("@b/utils/currency");
exports.metadata = {
    summary: "Get form structure for P2P Offers",
    operationId: "getP2pOfferStructure",
    tags: ["P2P Offers"],
    responses: {
        200: {
            description: "Form structure for managing P2P Offers",
            content: constants_1.structureSchema,
        },
    },
    requiresAuth: true,
};
const p2pOfferStructure = async (userId) => {
    const paymentMethods = await db_1.models.p2pPaymentMethod.findAll({
        where: { status: true, userId },
    });
    const paymentMethodId = {
        type: "select",
        label: "Payment Method ID",
        name: "paymentMethodId",
        options: paymentMethods.map((method) => ({
            value: method.id,
            label: method.name,
        })),
        placeholder: "Select payment method",
    };
    const walletType = {
        type: "select",
        label: "Wallet Type",
        name: "walletType",
        options: [
            { value: "FIAT", label: "Fiat" },
            { value: "SPOT", label: "Spot" },
        ],
        placeholder: "Select wallet type",
    };
    const currencyConditions = await (0, currency_1.getCurrencyConditions)();
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (extensions.has("ecosystem")) {
        walletType.options.push({ value: "ECO", label: "Funding" });
    }
    const currency = {
        type: "select",
        label: "Currency",
        name: "currency",
        options: [],
        conditions: {
            walletType: currencyConditions,
        },
    };
    const chain = {
        type: "input",
        label: "Chain",
        name: "chain",
        placeholder: "Blockchain network (optional)",
        condition: { walletType: "ECO" },
    };
    const amount = {
        type: "input",
        label: "Total Amount",
        name: "amount",
        placeholder: "Total amount for the offer",
        ts: "number",
    };
    const minAmount = {
        type: "input",
        label: "Minimum Amount",
        name: "minAmount",
        placeholder: "Minimum transaction amount",
        ts: "number",
    };
    const maxAmount = {
        type: "input",
        label: "Maximum Amount",
        name: "maxAmount",
        placeholder: "Maximum transaction amount",
        ts: "number",
    };
    const inOrder = {
        type: "input",
        label: "In Order",
        name: "inOrder",
        placeholder: "Amount currently in order",
        ts: "number",
    };
    const price = {
        type: "input",
        label: "Price per Unit",
        name: "price",
        placeholder: "Set price per unit of currency",
        ts: "number",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "ACTIVE", label: "Active" },
        ],
        placeholder: "Select the offer status",
        editable: {
            status: ["PENDING", "ACTIVE"],
        },
    };
    return {
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
    };
};
exports.p2pOfferStructure = p2pOfferStructure;
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { walletType, currency, chain, minAmount, maxAmount, price, paymentMethodId, status, } = await (0, exports.p2pOfferStructure)(user.id);
    return {
        get: [
            [walletType, chain, currency],
            [paymentMethodId, price],
            [minAmount, maxAmount],
            status,
        ],
        set: [
            [walletType, chain, currency],
            [paymentMethodId, price],
            [minAmount, maxAmount],
        ],
        edit: [[paymentMethodId, price], [minAmount, maxAmount], status],
    };
};
