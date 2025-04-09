"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTokenSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseTokenSchema = {
    name: (0, schema_1.baseStringSchema)("Token name"),
    currency: (0, schema_1.baseStringSchema)("Token currency code"),
    chain: (0, schema_1.baseStringSchema)("Blockchain chain name"),
    type: (0, schema_1.baseStringSchema)("Token type"),
    status: (0, schema_1.baseBooleanSchema)("Token status"),
    precision: (0, schema_1.baseNumberSchema)("Token precision"),
    limits: {
        type: "object",
        description: "Token transfer limits",
        // Define specific properties if necessary
    },
    decimals: (0, schema_1.baseNumberSchema)("Token decimal places"),
    icon: (0, schema_1.baseStringSchema)("Token icon URL", 255, 0, true),
    contractType: (0, schema_1.baseStringSchema)("Type of token contract"),
    network: (0, schema_1.baseStringSchema)("Network type"),
    fee: {
        type: "object",
        description: "Token fee",
        // Define specific properties if necessary
    },
};
