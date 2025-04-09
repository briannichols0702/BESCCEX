"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCurrentAllocation = exports.icoAllocationStoreSchema = exports.icoAllocationUpdateSchema = exports.baseIcoAllocationSchema = exports.icoAllocationSchema = void 0;
const db_1 = require("@b/db");
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the ICO Allocation");
const name = (0, schema_1.baseStringSchema)("Name of the ICO Allocation", 191);
const percentage = (0, schema_1.baseNumberSchema)("Percentage allocated");
const tokenId = (0, schema_1.baseStringSchema)("ID of the associated ICO Token", 36);
const status = (0, schema_1.baseEnumSchema)("Status of the ICO Allocation", [
    "PENDING",
    "COMPLETED",
    "CANCELLED",
    "REJECTED",
]);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation Date of the ICO Allocation");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last Update Date of the ICO Allocation", true);
const deletedAt = (0, schema_1.baseDateTimeSchema)("Deletion Date of the ICO Allocation", true);
exports.icoAllocationSchema = {
    id,
    name,
    percentage,
    tokenId,
    status,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.baseIcoAllocationSchema = {
    id,
    name,
    percentage,
    tokenId,
    status,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.icoAllocationUpdateSchema = {
    type: "object",
    properties: {
        name,
        percentage,
        tokenId,
        status,
    },
    required: ["name", "percentage", "tokenId", "status"],
};
exports.icoAllocationStoreSchema = {
    description: `ICO Allocation created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseIcoAllocationSchema,
            },
        },
    },
};
async function calculateCurrentAllocation(tokenId, t) {
    const allocations = await db_1.models.icoAllocation.findAll({
        where: { tokenId },
        attributes: ["percentage"],
        transaction: t,
    });
    return allocations.reduce((total, allocation) => total + allocation.percentage, 0);
}
exports.calculateCurrentAllocation = calculateCurrentAllocation;
