"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycTemplateStoreSchema = exports.kycTemplateUpdateSchema = exports.kycTemplateSchema = exports.baseKycTemplateSchema = void 0;
const schema_1 = require("@b/utils/schema");
// Base schema components for KYC templates
const id = (0, schema_1.baseStringSchema)("ID of the KYC template");
const title = (0, schema_1.baseStringSchema)("Title of the KYC template");
const options = {
    ...(0, schema_1.baseObjectSchema)("Options included in the KYC template"),
    additionalProperties: true,
};
const customOptions = {
    type: "object",
    description: "Custom options for the KYC template",
    additionalProperties: {
        type: "object",
        properties: {
            required: (0, schema_1.baseBooleanSchema)("Whether the field is required"),
            type: (0, schema_1.baseStringSchema)("Type of field"),
            level: {
                type: "string",
                description: "Level of verification required",
                enum: ["1", "2", "3"],
            },
        },
    },
};
// Base schema definition for KYC templates
exports.baseKycTemplateSchema = {
    id,
    title,
    options,
    customOptions,
};
// Full schema for a KYC template including applications
exports.kycTemplateSchema = {
    ...exports.baseKycTemplateSchema,
    kyc: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: { type: "string", description: "ID of the KYC application" },
                userId: { type: "string", description: "ID of the user" },
                templateId: { type: "string", description: "ID of the KYC template" },
                data: {
                    type: "object",
                    description: "Data provided in the KYC application",
                },
                status: {
                    type: "string",
                    description: "Status of the KYC application",
                },
                level: {
                    type: "integer",
                    description: "Level of the KYC verification",
                },
                notes: {
                    type: "string",
                    description: "Administrative notes on the KYC application",
                },
                createdAt: {
                    type: "string",
                    format: "date-time",
                    description: "Creation date and time of the KYC application",
                },
            },
        },
        description: "List of KYC applications using this template",
    },
};
// Schema for updating a KYC template
exports.kycTemplateUpdateSchema = {
    type: "object",
    properties: {
        title,
        options,
        customOptions,
    },
    required: ["title", "options", "customOptions"],
};
// Schema for defining a new KYC template
exports.kycTemplateStoreSchema = {
    ...exports.baseKycTemplateSchema,
};
