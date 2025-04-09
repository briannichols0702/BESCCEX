"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific exchange",
    operationId: "updateExchange",
    tags: ["Admin", "Exchanges"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the exchange to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the exchange",
        content: {
            "application/json": {
                schema: utils_1.exchangeUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Exchange"),
    requiresAuth: true,
    permission: "Access Exchange Provider Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, title, status, username, licenseStatus, version, productId, type, } = body;
    return await (0, query_1.updateRecord)("exchange", id, {
        name,
        title,
        status,
        username,
        licenseStatus,
        version,
        productId,
        type,
    });
};
