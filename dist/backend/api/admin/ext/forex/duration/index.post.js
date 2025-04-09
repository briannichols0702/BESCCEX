"use strict";
// /api/admin/forex/durations/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Forex Duration",
    operationId: "storeForexDuration",
    tags: ["Admin", "Forex Durations"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.forexDurationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.forexDurationStoreSchema, "Forex Duration"),
    requiresAuth: true,
    permission: "Access Forex Duration Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { duration, timeframe } = body;
    return await (0, query_1.storeRecord)({
        model: "forexDuration",
        data: {
            duration,
            timeframe,
        },
    });
};
