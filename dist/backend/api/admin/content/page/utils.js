"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageStoreSchema = exports.pageUpdateSchema = exports.basePageSchema = void 0;
const schema_1 = require("@b/utils/schema"); // Adjust the import path as necessary
// Base schema components for CMS pages
const id = {
    ...(0, schema_1.baseStringSchema)("ID of the CMS page"),
    nullable: true, // Optional for creation
};
const title = (0, schema_1.baseStringSchema)("Title of the CMS page");
const content = (0, schema_1.baseStringSchema)("Content of the CMS page");
const description = {
    ...(0, schema_1.baseStringSchema)("Short description of the CMS page"),
    nullable: true,
};
const image = {
    ...(0, schema_1.baseStringSchema)("URL to the image associated with the CMS page"),
    nullable: true,
};
const slug = (0, schema_1.baseStringSchema)("Slug for the CMS page URL");
const status = (0, schema_1.baseEnumSchema)("Publication status of the CMS page", [
    "PUBLISHED",
    "DRAFT",
]);
// Base schema definition for CMS pages
exports.basePageSchema = {
    id,
    title,
    content,
    description,
    image,
    slug,
    status,
};
// Schema for updating a CMS page
exports.pageUpdateSchema = {
    type: "object",
    properties: {
        title,
        content,
        description,
        image,
        slug,
        status,
    },
    required: ["title", "content", "slug", "status"], // Ensure these are the fields you want to be required
};
// Schema for defining a new CMS page
exports.pageStoreSchema = {
    description: `Page created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.basePageSchema,
            },
        },
    },
};
