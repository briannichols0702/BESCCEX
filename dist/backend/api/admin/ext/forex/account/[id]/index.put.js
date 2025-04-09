"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Forex Account",
    operationId: "updateForexAccount",
    tags: ["Admin", "Forex Accounts"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the Forex Account to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Forex Account",
        content: {
            "application/json": {
                schema: utils_1.forexAccountUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Forex Account"),
    requiresAuth: true,
    permission: "Access Forex Account Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { userId, accountId, password, broker, mt, balance, leverage, type, status, } = body;
    return await (0, query_1.updateRecord)("forexAccount", id, {
        userId,
        accountId,
        password,
        broker,
        mt,
        balance,
        leverage,
        type,
        status,
    });
};
