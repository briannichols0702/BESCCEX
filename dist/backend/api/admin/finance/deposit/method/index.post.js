"use strict";
// /api/admin/deposit/methods/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new deposit method",
    operationId: "storeDepositMethod",
    tags: ["Admin", "Deposit Methods"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.depositMethodUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.DepositMethodSchema, "Deposit Method"),
    requiresAuth: true,
    permission: "Access Deposit Method Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { title, instructions, image, fixedFee, percentageFee, minAmount, maxAmount, customFields, status, } = body;
    // Ensure customFields is an array
    let parsedCustomFields = Array.isArray(customFields) ? customFields : [];
    if (typeof customFields === "string") {
        try {
            const parsed = JSON.parse(customFields);
            parsedCustomFields = Array.isArray(parsed) ? parsed : [];
        }
        catch (error) {
            throw new Error("Invalid JSON format for customFields");
        }
    }
    return await (0, query_1.storeRecord)({
        model: "depositMethod",
        data: {
            title,
            instructions,
            image,
            fixedFee,
            percentageFee,
            minAmount,
            maxAmount,
            customFields: parsedCustomFields,
            status,
        },
    });
};
