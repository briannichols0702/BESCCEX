"use strict";
// /api/admin/forex/signals/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Forex Signal",
    operationId: "storeForexSignal",
    tags: ["Admin", "Forex Signals"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.forexSignalUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.forexSignalSchema, "Forex Signal"),
    requiresAuth: true,
    permission: "Access Forex Signal Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { title, image, status } = body;
    return await (0, query_1.storeRecord)({
        model: "forexSignal",
        data: {
            title,
            image,
            status,
        },
    });
};
