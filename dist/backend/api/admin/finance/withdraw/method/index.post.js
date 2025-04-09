"use strict";
// /api/admin/withdraw/methods/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new withdrawal method",
    operationId: "storeWithdrawMethod",
    tags: ["Admin", "Withdraw Methods"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: utils_1.baseWithdrawMethodSchema,
                    required: [
                        "title",
                        "processingTime",
                        "instructions",
                        "fixedFee",
                        "percentageFee",
                        "minAmount",
                        "maxAmount",
                        "status",
                    ],
                },
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.withdrawalMethodStoreSchema, "Withdraw Method"),
    requiresAuth: true,
    permission: "Access Withdrawal Method Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { title, processingTime, instructions, image, fixedFee, percentageFee, minAmount, maxAmount, customFields, status, } = body;
    return await (0, query_1.storeRecord)({
        model: "withdrawMethod",
        data: {
            title,
            processingTime,
            instructions,
            image,
            fixedFee,
            percentageFee,
            minAmount,
            maxAmount,
            customFields,
            status,
        },
    });
};
