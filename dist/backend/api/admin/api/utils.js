"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyUpdateSchema = exports.apiKeyStoreSchema = exports.apiKeySchema = void 0;
const schema_1 = require("@b/utils/schema");
// Existing fields
const id = (0, schema_1.baseStringSchema)("ID of the API key");
const userId = (0, schema_1.baseStringSchema)("User ID associated with the API key");
const key = (0, schema_1.baseStringSchema)("The API key string");
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the API key");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the API key", true);
const deletedAt = (0, schema_1.baseDateTimeSchema)("Deletion date of the API key", true);
// New fields
const name = (0, schema_1.baseStringSchema)("Name of the API key");
const type = {
    type: "string",
    enum: ["plugin", "user"],
    description: "Type of the API key (e.g., plugin, user)",
};
const permissions = {
    type: "array",
    items: { type: "string" },
    description: "Permissions associated with the API key",
};
const ipWhitelist = {
    type: "array",
    items: { type: "string" },
    description: "IP addresses whitelisted for the API key",
};
const ipRestriction = {
    type: "boolean",
    description: "Whether IP restriction is enabled for the API key",
};
// Updated schema
exports.apiKeySchema = {
    id: id,
    userId: userId,
    name: name,
    type: type, // Added type field
    key: key,
    permissions: permissions,
    ipWhitelist: ipWhitelist,
    ipRestriction: ipRestriction,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: deletedAt,
};
// Updated schema for API key creation
exports.apiKeyStoreSchema = {
    type: "object",
    properties: {
        userId: userId,
        name: name,
        type: type, // Include type in creation
        permissions: permissions,
        ipWhitelist: ipWhitelist,
        ipRestriction: ipRestriction,
    },
    required: ["userId", "name", "type"], // Fields required for creating a new API key
};
// Updated schema for API key updates
exports.apiKeyUpdateSchema = {
    type: "object",
    properties: {
        name: name, // Allow updating name
        type: type, // Allow updating type
        permissions: permissions, // Allow updating permissions
        ipWhitelist: ipWhitelist, // Allow updating IP whitelist
        ipRestriction: ipRestriction, // Allow updating IP restriction
    },
    required: ["type"], // At least type is required for updates
};
