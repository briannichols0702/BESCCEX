"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icoPhaseStoreSchema = exports.icoPhaseUpdateSchema = exports.baseIcoPhaseSchema = exports.icoPhaseSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the ICO Phase");
const name = (0, schema_1.baseStringSchema)("Name of the ICO Phase");
const startDate = (0, schema_1.baseDateTimeSchema)("Start Date of the ICO Phase");
const endDate = (0, schema_1.baseDateTimeSchema)("End Date of the ICO Phase");
const price = (0, schema_1.baseNumberSchema)("Price per token during this phase");
const status = (0, schema_1.baseEnumSchema)("Current status of the phase", [
    "PENDING",
    "ACTIVE",
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
]);
const tokenId = (0, schema_1.baseStringSchema)("Associated Token ID");
const minPurchase = (0, schema_1.baseNumberSchema)("Minimum purchase amount");
const maxPurchase = (0, schema_1.baseNumberSchema)("Maximum purchase amount");
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation Date of the Phase");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last Update Date of the Phase", true);
const deletedAt = (0, schema_1.baseDateTimeSchema)("Deletion Date of the Phase", true);
exports.icoPhaseSchema = {
    id,
    name,
    startDate,
    endDate,
    price,
    status,
    tokenId,
    minPurchase,
    maxPurchase,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.baseIcoPhaseSchema = {
    id,
    name,
    startDate,
    endDate,
    price,
    status,
    tokenId,
    minPurchase,
    maxPurchase,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.icoPhaseUpdateSchema = {
    type: "object",
    properties: {
        name,
        startDate,
        endDate,
        price,
        status,
        tokenId,
        minPurchase,
        maxPurchase,
    },
    required: [
        "name",
        "startDate",
        "endDate",
        "price",
        "status",
        "tokenId",
        "minPurchase",
        "maxPurchase",
    ],
};
exports.icoPhaseStoreSchema = {
    description: `ICO Phase created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseIcoPhaseSchema,
            },
        },
    },
};
