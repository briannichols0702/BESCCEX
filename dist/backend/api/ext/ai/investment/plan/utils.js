"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTradingPlanSchema = exports.baseDurationSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseDurationSchema = {
    id: (0, schema_1.baseStringSchema)("Unique identifier of the duration"),
    duration: (0, schema_1.baseNumberSchema)("Duration number"),
    timeframe: (0, schema_1.baseStringSchema)("Timeframe of the duration (e.g., days, months)"),
};
exports.baseTradingPlanSchema = {
    id: (0, schema_1.baseStringSchema)("The unique identifier for the trading plan"),
    title: (0, schema_1.baseStringSchema)("Title of the trading plan"),
    description: (0, schema_1.baseStringSchema)("Description of the trading plan"),
    image: (0, schema_1.baseStringSchema)("URL of the image representing the trading plan"),
    minAmount: (0, schema_1.baseNumberSchema)("Minimum amount required to invest in the plan"),
    maxAmount: (0, schema_1.baseNumberSchema)("Maximum amount allowed for investment in the plan"),
    invested: (0, schema_1.baseNumberSchema)("Total amount currently invested in the plan"),
    trending: (0, schema_1.baseBooleanSchema)("Indicator if the plan is trending"),
    status: (0, schema_1.baseBooleanSchema)("Status of the trading plan (active/inactive)"),
    durations: {
        type: "array",
        description: "List of durations available for this trading plan",
        items: {
            type: "object",
            properties: exports.baseDurationSchema,
            required: ["id", "duration", "timeframe"],
        },
    },
};
