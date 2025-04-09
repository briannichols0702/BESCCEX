"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pOfferStoreSchema = exports.p2pOfferUpdateSchema = exports.baseP2pOfferSchema = exports.p2pOfferSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the P2P Offer");
const userId = (0, schema_1.baseStringSchema)("ID of the User who created the offer");
const walletType = (0, schema_1.baseEnumSchema)("Type of wallet used in the offer", [
    "FIAT",
    "SPOT",
    "ECO",
]);
const currency = (0, schema_1.baseStringSchema)("Currency of the offer");
const chain = (0, schema_1.baseStringSchema)("Blockchain chain used, if any", 191, 0, true);
const amount = (0, schema_1.baseNumberSchema)("Total amount of the offer");
const minAmount = (0, schema_1.baseNumberSchema)("Minimum amount acceptable");
const maxAmount = (0, schema_1.baseNumberSchema)("Maximum amount acceptable", true);
const inOrder = (0, schema_1.baseNumberSchema)("Amount currently in order");
const price = (0, schema_1.baseNumberSchema)("Price per unit of currency");
const paymentMethodId = (0, schema_1.baseStringSchema)("ID of the payment method used");
const status = (0, schema_1.baseEnumSchema)("Current status of the offer", [
    "PENDING",
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
]);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the offer");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the offer", true);
exports.p2pOfferSchema = {
    id,
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
    createdAt,
    updatedAt,
};
exports.baseP2pOfferSchema = {
    id,
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
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the offer, if any"),
};
exports.p2pOfferUpdateSchema = {
    type: "object",
    properties: {
        amount,
        minAmount,
        maxAmount,
        price,
        status,
    },
    required: ["status", "amount", "minAmount", "price"],
};
exports.p2pOfferStoreSchema = {
    description: `P2P Offer created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseP2pOfferSchema,
            },
        },
    },
};
