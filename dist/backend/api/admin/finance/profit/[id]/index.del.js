"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Admin Profit record",
    operationId: "deleteAdminProfit",
    tags: ["Admin", "Finance", "Profits"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the Admin Profit to delete",
            required: true,
            schema: { type: "string" },
        },
        {
            name: "restore",
            in: "query",
            description: "Restore the Admin Profit instead of deleting",
            required: false,
            schema: { type: "boolean" },
        },
        {
            name: "force",
            in: "query",
            description: "Delete the Admin Profit permanently",
            required: false,
            schema: { type: "boolean" },
        },
    ],
    responses: {
        200: {
            description: "Admin Profit deleted successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
    },
    permission: "Access Admin Profits",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    const { id } = params;
    return await (0, query_1.handleSingleDelete)({
        model: "adminProfit",
        id,
        query,
    });
};
