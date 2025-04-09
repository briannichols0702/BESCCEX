"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeOrderUpdateSchema = exports.orderSchema = void 0;
const schema_1 = require("@b/utils/schema");
// Base schema for exchange orders using reusable schema components
const id = {
    ...(0, schema_1.baseStringSchema)("ID of the exchange order"),
    nullable: true, // Optional for creation or updates where not needed
};
const referenceId = {
    ...(0, schema_1.baseStringSchema)("Reference ID of the order"),
    nullable: true,
};
const userId = {
    ...(0, schema_1.baseStringSchema)("User ID associated with the order"),
    nullable: true,
};
const status = {
    ...(0, schema_1.baseStringSchema)("Current status of the order"),
    enum: ["OPEN", "CLOSED", "CANCELLED"],
};
const symbol = (0, schema_1.baseStringSchema)("Trading symbol of the order");
const type = {
    ...(0, schema_1.baseStringSchema)("Type of the order (LIMIT, MARKET)"),
    enum: ["LIMIT", "MARKET"],
};
const timeInForce = {
    ...(0, schema_1.baseStringSchema)("Time in Force for the order (GTC, IOC)"),
    enum: ["GTC", "IOC"],
};
const side = {
    ...(0, schema_1.baseStringSchema)("Side of the order (BUY, SELL)"),
    enum: ["BUY", "SELL"],
};
const price = (0, schema_1.baseNumberSchema)("Price at which the order was placed");
const amount = (0, schema_1.baseNumberSchema)("Amount traded in the order");
const fee = (0, schema_1.baseNumberSchema)("Transaction fee for the order");
const feeCurrency = (0, schema_1.baseStringSchema)("Currency of the transaction fee");
const user = {
    type: "object",
    properties: {
        id: { type: "string", description: "User ID" },
        firstName: {
            ...(0, schema_1.baseStringSchema)("User's first name"),
            nullable: true,
        },
        lastName: {
            ...(0, schema_1.baseStringSchema)("User's last name"),
            nullable: true,
        },
        avatar: {
            ...(0, schema_1.baseStringSchema)("User's avatar"),
            nullable: true,
        },
    },
    nullable: true,
};
const baseExchangeOrderSchema = {
    id,
    referenceId,
    userId,
    status,
    symbol,
    type,
    timeInForce,
    side,
    price,
    amount,
    fee,
    feeCurrency,
    user,
};
// Full schema for an exchange order including user details
exports.orderSchema = {
    ...baseExchangeOrderSchema,
    id: {
        ...(0, schema_1.baseStringSchema)("ID of the created exchange order"),
        nullable: false, // ID should always be present for a created order
    },
};
// Schema for updating an exchange order
exports.exchangeOrderUpdateSchema = {
    type: "object",
    properties: {
        referenceId,
        symbol,
        type,
        timeInForce,
        status,
        side,
        price,
        amount,
        feeCurrency,
        fee,
    },
    required: [
        "referenceId",
        "status",
        "symbol",
        "type",
        "timeInForce",
        "side",
        "price",
        "amount",
        "fee",
        "feeCurrency",
    ],
};
