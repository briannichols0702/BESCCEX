"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseForexTransactionSchema = exports.forexWalletSchema = exports.baseForexPlanSchema = exports.forexPlanDurationSchema = void 0;
// Assuming base schemas are already created as previously suggested
const schema_1 = require("@b/utils/schema");
exports.forexPlanDurationSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: (0, schema_1.baseStringSchema)("Duration ID"),
            duration: (0, schema_1.baseNumberSchema)("Duration value"),
            timeframe: (0, schema_1.baseStringSchema)("Timeframe of the duration"),
        },
        required: ["id", "duration", "timeframe"],
    },
};
exports.baseForexPlanSchema = {
    id: (0, schema_1.baseStringSchema)("Forex plan ID"),
    title: (0, schema_1.baseStringSchema)("Plan title"),
    description: (0, schema_1.baseStringSchema)("Plan description"),
    image: (0, schema_1.baseStringSchema)("Plan image URL"),
    minAmount: (0, schema_1.baseNumberSchema)("Minimum investment amount"),
    maxAmount: (0, schema_1.baseNumberSchema)("Maximum investment amount"),
    invested: (0, schema_1.baseNumberSchema)("Total amount invested in this plan"),
    trending: (0, schema_1.baseBooleanSchema)("Indicates if the plan is trending"),
    status: (0, schema_1.baseBooleanSchema)("Active status of the plan"),
    forexPlanDuration: exports.forexPlanDurationSchema,
};
exports.forexWalletSchema = {
    type: "object",
    properties: {
        currency: (0, schema_1.baseStringSchema)("Wallet currency"),
        type: (0, schema_1.baseStringSchema)("Wallet type"),
    },
};
exports.baseForexTransactionSchema = {
    id: (0, schema_1.baseStringSchema)("Transaction ID"),
    userId: (0, schema_1.baseStringSchema)("User ID"),
    type: (0, schema_1.baseStringSchema)("Transaction type"),
    amount: (0, schema_1.baseNumberSchema)("Transaction amount"),
    description: (0, schema_1.baseStringSchema)("Transaction description"),
    status: (0, schema_1.baseStringSchema)("Transaction status"),
    wallet: exports.forexWalletSchema,
};
