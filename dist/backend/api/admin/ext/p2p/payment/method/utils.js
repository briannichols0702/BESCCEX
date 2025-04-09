"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pPaymentMethodStoreSchema = exports.p2pPaymentMethodUpdateSchema = exports.baseP2pPaymentMethodSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the P2P Payment Method");
const userId = (0, schema_1.baseStringSchema)("ID of the User who owns the payment method");
const name = (0, schema_1.baseStringSchema)("Name of the payment method");
const instructions = (0, schema_1.baseStringSchema)("Instructions for using the payment method");
const walletType = (0, schema_1.baseEnumSchema)("Type of wallet used in the offer", [
    "FIAT",
    "SPOT",
    "ECO",
]);
const currency = (0, schema_1.baseStringSchema)("Currency of the offer");
const chain = (0, schema_1.baseStringSchema)("Blockchain chain used, if any", 191, 0, true);
const image = (0, schema_1.baseStringSchema)("URL to an image of the payment method");
const status = (0, schema_1.baseBooleanSchema)("Active status of the payment method");
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the payment method");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the payment method");
exports.baseP2pPaymentMethodSchema = {
    id,
    userId,
    name,
    instructions,
    walletType,
    chain,
    currency,
    image,
    status,
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the payment method, if any"),
};
exports.p2pPaymentMethodUpdateSchema = {
    type: "object",
    properties: {
        name,
        instructions,
        walletType,
        chain,
        currency,
        image,
        status,
    },
    required: ["name", "instructions", "walletType", "currency", "status"],
};
exports.p2pPaymentMethodStoreSchema = {
    description: `P2P Payment Method created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseP2pPaymentMethodSchema,
            },
        },
    },
};
