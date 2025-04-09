"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/exchange/currencies/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates an existing exchange currency",
    operationId: "updateExchangeCurrency",
    tags: ["Admin", "Exchange", "Currencies"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the currency to update.",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the exchange currency",
        content: {
            "application/json": {
                schema: utils_1.exchangeCurrencyUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Exchange Currency"),
    requiresAuth: true,
    permission: "Access Spot Currency Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, chains } = body;
    return await (0, query_1.updateRecord)("exchangeCurrency", id, { name, chains });
};
