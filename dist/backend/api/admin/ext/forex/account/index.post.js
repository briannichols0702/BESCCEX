"use strict";
// /api/admin/forex/accounts/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Forex Account",
    operationId: "storeForexAccount",
    tags: ["Admin", "Forex Accounts"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.forexAccountUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.forexAccountStoreSchema, "Forex Account"),
    requiresAuth: true,
    permission: "Access Forex Account Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, accountId, password, broker, mt, balance, leverage, type, status, } = body;
    return await (0, query_1.storeRecord)({
        model: "forexAccount",
        data: {
            userId,
            accountId,
            password,
            broker,
            mt,
            balance,
            leverage,
            type,
            status,
        },
    });
};
