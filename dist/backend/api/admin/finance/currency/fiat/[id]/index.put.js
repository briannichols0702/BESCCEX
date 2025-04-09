"use strict";
// /server/api/admin/currencies/fiat/[id]/update.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific currency by symbol",
    operationId: "updateCurrencyBySymbol",
    tags: ["Admin", "Currencies"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the user to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.fiatCurrencyUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Fiat Currency"),
    requiresAuth: true,
    permission: "Access Fiat Currency Management",
};
exports.default = async (data) => {
    const { params, body } = data;
    const { id } = params;
    const { price } = body;
    return await (0, query_1.updateRecord)("currency", id, { price });
};
