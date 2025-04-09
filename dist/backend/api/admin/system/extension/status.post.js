"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Bulk updates the status of extensions",
    operationId: "bulkUpdateExtensionStatus",
    tags: ["Admin", "Extensions"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of extension IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "boolean",
                            description: "New status to apply to the extensions (true for active, false for inactive)",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Extension"),
    requiresAuth: true,
    permission: "Access Extension Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    // Update the statuses in the database
    const updateResult = await (0, query_1.updateStatus)("extension", ids, status);
    // Clear cache after update
    const cacheManager = cache_1.CacheManager.getInstance();
    await cacheManager.clearCache();
    return updateResult;
};
