"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icoTokenStoreSchema = exports.icoTokenUpdateSchema = exports.baseIcoTokenSchema = exports.icoTokenSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the ICO Token");
const name = (0, schema_1.baseStringSchema)("Name of the ICO Token");
const chain = (0, schema_1.baseStringSchema)("Blockchain Chain for the ICO Token");
const currency = (0, schema_1.baseStringSchema)("Currency type of the ICO Token");
const purchaseCurrency = (0, schema_1.baseStringSchema)("Currency used to purchase the ICO Token");
const purchaseWalletType = (0, schema_1.baseEnumSchema)("Type of wallet used for purchasing the ICO Token", ["FIAT", "SPOT", "ECO"]);
const address = (0, schema_1.baseStringSchema)("Blockchain address of the ICO Token");
const totalSupply = (0, schema_1.baseNumberSchema)("Total supply of the ICO Token");
const description = {
    type: "string",
    description: "Description of the ICO Token",
};
const image = (0, schema_1.baseStringSchema)("Image URL of the ICO Token");
const status = (0, schema_1.baseEnumSchema)("Current status of the ICO Token", [
    "PENDING",
    "ACTIVE",
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
]);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation Date of the ICO Token");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last Update Date of the ICO Token", true);
const projectId = (0, schema_1.baseStringSchema)("ID of the related ICO Project");
exports.icoTokenSchema = {
    id,
    name,
    chain,
    currency,
    purchaseCurrency,
    purchaseWalletType,
    address,
    totalSupply,
    description,
    image,
    status,
    createdAt,
    updatedAt,
    projectId,
};
exports.baseIcoTokenSchema = {
    id,
    name,
    chain,
    currency,
    purchaseCurrency,
    purchaseWalletType,
    address,
    totalSupply,
    description,
    image,
    status,
    projectId,
    createdAt,
    updatedAt,
};
exports.icoTokenUpdateSchema = {
    type: "object",
    properties: {
        name,
        chain,
        currency,
        purchaseCurrency,
        purchaseWalletType,
        address,
        totalSupply,
        description,
        image,
        status,
        projectId,
    },
    required: [
        "name",
        "chain",
        "currency",
        "purchaseCurrency",
        "purchaseWalletType",
        "address",
        "totalSupply",
        "description",
        "image",
        "status",
        "projectId",
    ],
};
exports.icoTokenStoreSchema = {
    description: `ICO Token created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseIcoTokenSchema,
            },
        },
    },
};
