"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icoProjectStoreSchema = exports.icoProjectUpdateSchema = exports.baseIcoProjectSchema = exports.icoProjectSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the ICO Project");
const name = (0, schema_1.baseStringSchema)("Name of the ICO Project");
const description = (0, schema_1.baseStringSchema)("Description of the ICO Project", 5000);
const website = (0, schema_1.baseStringSchema)("Website URL of the ICO Project");
const whitepaper = (0, schema_1.baseStringSchema)("Whitepaper of the ICO Project", 5000);
const image = (0, schema_1.baseStringSchema)("Image URL of the ICO Project");
const status = (0, schema_1.baseEnumSchema)("Current status of the project", [
    "PENDING",
    "ACTIVE",
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
]);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation Date of the Project");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last Update Date of the Project", true);
const deletedAt = (0, schema_1.baseDateTimeSchema)("Deletion Date of the Project", true);
exports.icoProjectSchema = {
    id,
    name,
    description,
    website,
    whitepaper,
    image,
    status,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.baseIcoProjectSchema = {
    id,
    name,
    description,
    website,
    whitepaper,
    image,
    status,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.icoProjectUpdateSchema = {
    type: "object",
    properties: {
        name,
        description,
        website,
        whitepaper,
        image,
        status,
    },
    required: ["name", "description", "website", "whitepaper", "image", "status"],
};
exports.icoProjectStoreSchema = {
    description: `ICO Project created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseIcoProjectSchema,
            },
        },
    },
};
