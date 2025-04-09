"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/withdraw/methods/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates an existing withdrawal method",
    operationId: "updateWithdrawMethod",
    tags: ["Admin", "Withdraw Methods"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the withdrawal method to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the withdrawal method",
        content: {
            "application/json": {
                schema: utils_1.withdrawalMethodUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Withdraw Method"),
    requiresAuth: true,
    permission: "Access Withdrawal Method Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { title, processingTime, instructions, image, fixedFee, percentageFee, minAmount, maxAmount, customFields, status, } = body;
    return await (0, query_1.updateRecord)("withdrawMethod", id, {
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
    });
};
