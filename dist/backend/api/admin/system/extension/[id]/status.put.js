"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Update Status for an Extension",
    operationId: "updateExtensionStatus",
    tags: ["Admin", "Extensions"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Extension to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "boolean",
                            description: "New status to apply to the Extension (true for active, false for inactive)",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Extension"),
    requiresAuth: true,
    permission: "Access Extension Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    try {
        // Update the status in the database
        await db_1.models.extension.update({ status }, { where: { productId: id } });
        // Clear the cache to ensure updated status is reflected
        const cacheManager = cache_1.CacheManager.getInstance();
        await cacheManager.clearCache();
        return { message: "Extension status updated successfully" };
    }
    catch (error) {
        console.error("Error updating extension status:", error);
        return { message: "Failed to update extension status", error };
    }
};
