"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates an existing deposit method",
    operationId: "updateDepositMethod",
    tags: ["Admin", "Deposit Methods"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the deposit method to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "New data for the deposit method",
        content: {
            "application/json": {
                schema: utils_1.depositMethodUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Deposit Method"),
    requiresAuth: true,
    permission: "Access Deposit Method Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { image, title, instructions, fixedFee, percentageFee, minAmount, maxAmount, status, customFields, } = body;
    // Parse customFields if it is a string
    let parsedCustomFields = customFields;
    if (typeof customFields === "string") {
        try {
            parsedCustomFields = JSON.parse(customFields);
        }
        catch (error) {
            throw new Error("Invalid JSON format for customFields");
        }
    }
    return await (0, query_1.updateRecord)("depositMethod", id, {
        image,
        title,
        instructions,
        fixedFee,
        percentageFee,
        minAmount,
        maxAmount,
        status,
        customFields: parsedCustomFields,
    });
};
