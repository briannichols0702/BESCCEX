"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseCurrencySchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseCurrencySchema = {
    id: (0, schema_1.baseStringSchema)("Unique identifier for the currency"),
    currency: (0, schema_1.baseStringSchema)("Currency code (e.g., USD, EUR)"),
    name: (0, schema_1.baseStringSchema)("Full name of the currency"),
    precision: (0, schema_1.baseNumberSchema)("Number of decimal places used by the currency"),
    price: (0, schema_1.baseNumberSchema)("Current price of the currency in USD"),
    status: (0, schema_1.baseBooleanSchema)("Active status of the currency"),
    chains: {
        type: "object",
        description: "Blockchain networks supported by the currency",
        additionalProperties: {
            type: "object",
            properties: {
                network: (0, schema_1.baseStringSchema)("Network name"),
                protocol: (0, schema_1.baseStringSchema)("Protocol used"),
            },
        },
    },
};
