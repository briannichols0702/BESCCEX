"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayUpdateSchema = exports.baseGatewaySchema = void 0;
const schema_1 = require("@b/utils/schema");
// Basic component definitions
const name = (0, schema_1.baseStringSchema)("Name of the deposit gateway", 100);
const title = (0, schema_1.baseStringSchema)("Title of the deposit gateway", 100);
const description = (0, schema_1.baseStringSchema)("Description of the deposit gateway", 500);
const image = (0, schema_1.baseStringSchema)("URL to an image representing the deposit gateway", 255, 0, true);
const fixedFee = {
    ...(0, schema_1.baseNumberSchema)("Fixed fee for transactions through this gateway"),
    nullable: true,
    minimum: 0,
};
const percentageFee = {
    ...(0, schema_1.baseNumberSchema)("Percentage fee for transactions through this gateway"),
    nullable: true,
    minimum: 0,
    maximum: 100,
};
const minAmount = {
    ...(0, schema_1.baseNumberSchema)("Minimum amount allowed through this gateway"),
    nullable: true,
    minimum: 0,
};
const maxAmount = {
    ...(0, schema_1.baseNumberSchema)("Maximum amount allowed through this gateway"),
    nullable: true,
    minimum: 0,
};
const status = (0, schema_1.baseBooleanSchema)("Current status of the deposit gateway (active or inactive)");
// Now using these components in your base schema
exports.baseGatewaySchema = {
    id: {
        ...(0, schema_1.baseStringSchema)("ID of the deposit gateway"),
        nullable: true,
    },
    name,
    title,
    description,
    image,
    alias: {
        ...(0, schema_1.baseStringSchema)("Unique alias for the deposit gateway"),
        nullable: true,
    },
    currencies: {
        type: "object",
        description: "Supported currencies in JSON format",
        nullable: true,
    },
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    type: {
        ...(0, schema_1.baseStringSchema)("Type of the deposit gateway"),
        nullable: true,
    },
    status,
    version: {
        ...(0, schema_1.baseStringSchema)("Version of the deposit gateway"),
        nullable: true,
    },
    productId: {
        ...(0, schema_1.baseStringSchema)("Product ID associated with the deposit gateway"),
        nullable: true,
    },
};
// Schema for updating an existing deposit gateway
exports.gatewayUpdateSchema = {
    type: "object",
    properties: {
        name,
        title,
        description,
        image,
        fixedFee,
        percentageFee,
        minAmount,
        maxAmount,
        status,
    },
    required: [
        "name",
        "title",
        "description",
        "fixedFee",
        "percentageFee",
        "minAmount",
    ],
};
