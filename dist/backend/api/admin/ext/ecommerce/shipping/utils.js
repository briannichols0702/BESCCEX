"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecommerceShippingUpdateSchema = exports.ecommerceShippingchema = void 0;
exports.ecommerceShippingchema = {
    id: { type: "string", format: "uuid" },
    loadId: { type: "string" },
    loadStatus: {
        type: "string",
        enum: ["PENDING", "TRANSIT", "DELIVERED", "CANCELLED"],
    },
    shipper: { type: "string" },
    transporter: { type: "string" },
    goodsType: { type: "string" },
    weight: { type: "number" },
    volume: { type: "number" },
    description: { type: "string" },
    vehicle: { type: "string" },
    cost: { type: "number" },
    tax: { type: "number" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
};
exports.ecommerceShippingUpdateSchema = {
    type: "object",
    properties: {
        loadId: { type: "string" },
        loadStatus: {
            type: "string",
            enum: ["PENDING", "TRANSIT", "DELIVERED", "CANCELLED"],
        },
        shipper: { type: "string" },
        transporter: { type: "string" },
        goodsType: { type: "string" },
        weight: { type: "number" },
        volume: { type: "number" },
        description: { type: "string" },
        vehicle: { type: "string" },
        cost: { type: "number" },
        tax: { type: "number" },
    },
    required: [
        "loadId",
        "loadStatus",
        "shipper",
        "transporter",
        "goodsType",
        "weight",
        "volume",
        "description",
        "vehicle",
        "cost",
        "tax",
    ],
};
