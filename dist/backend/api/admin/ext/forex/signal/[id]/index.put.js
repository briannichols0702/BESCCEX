"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Forex Signal",
    operationId: "updateForexSignal",
    tags: ["Admin", "Forex Signals"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the Forex Signal to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Forex Signal",
        content: {
            "application/json": {
                schema: utils_1.forexSignalUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Forex Signal"),
    requiresAuth: true,
    permission: "Access Forex Signal Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { title, image, status } = body;
    return await (0, query_1.updateRecord)("forexSignal", id, {
        title,
        image,
        status,
    });
};
