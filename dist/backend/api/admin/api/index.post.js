"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const index_post_1 = require("@b/api/api-key/index.post");
exports.metadata = {
    summary: "Stores a new API Key",
    operationId: "storeApiKey",
    tags: ["Admin", "API Keys"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.apiKeyUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.apiKeyStoreSchema, "API Key"),
    requiresAuth: true,
    permission: "Access API Key Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, name, type, permissions, ipRestriction, ipWhitelist } = body;
    // Ensure permissions and IP whitelist have the correct format
    const formattedPermissions = Array.isArray(permissions) ? permissions : [];
    const formattedIPWhitelist = Array.isArray(ipWhitelist) ? ipWhitelist : [];
    return await (0, query_1.storeRecord)({
        model: "apiKey",
        data: {
            userId,
            name,
            key: (0, index_post_1.generateApiKey)(), // Function to generate a secure API key
            type,
            permissions: formattedPermissions,
            ipRestriction,
            ipWhitelist: formattedIPWhitelist,
        },
    });
};
