"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseForexInvestmentSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseForexInvestmentSchema = {
    id: (0, schema_1.baseStringSchema)("Forex investment ID"),
    userId: (0, schema_1.baseStringSchema)("User ID"),
    accountId: (0, schema_1.baseStringSchema)("Forex account ID"),
    planId: (0, schema_1.baseStringSchema)("Forex plan ID"),
    durationId: (0, schema_1.baseStringSchema)("Forex duration ID"),
    amount: (0, schema_1.baseNumberSchema)("Investment amount"),
    status: (0, schema_1.baseStringSchema)("Investment status"),
    returns: (0, schema_1.baseNumberSchema)("Investment returns"),
    startDate: (0, schema_1.baseStringSchema)("Investment start date"),
    endDate: (0, schema_1.baseStringSchema)("Investment end date"),
    plan: {
        type: "object",
        properties: {
            id: (0, schema_1.baseStringSchema)("Forex plan ID"),
            name: (0, schema_1.baseStringSchema)("Plan name"),
            title: (0, schema_1.baseStringSchema)("Plan title"),
            description: (0, schema_1.baseStringSchema)("Plan description"),
            profit_percentage: (0, schema_1.baseNumberSchema)("Plan profit percentage"),
            image: (0, schema_1.baseStringSchema)("Plan image URL"),
        },
        required: [
            "id",
            "name",
            "title",
            "description",
            "profit_percentage",
            "image",
        ],
    },
    user: {
        type: "object",
        properties: {
            id: (0, schema_1.baseStringSchema)("User ID"),
            uuid: (0, schema_1.baseStringSchema)("User UUID"),
            avatar: (0, schema_1.baseStringSchema)("User avatar URL", 255, 0, true),
            first_name: (0, schema_1.baseStringSchema)("User first name"),
            last_name: (0, schema_1.baseStringSchema)("User last name"),
        },
        required: ["id", "uuid", "avatar", "first_name", "last_name"],
    },
    duration: {
        type: "object",
        properties: {
            id: (0, schema_1.baseStringSchema)("Forex duration ID"),
            duration: (0, schema_1.baseNumberSchema)("Duration"),
            timeframe: (0, schema_1.baseStringSchema)("Timeframe"),
        },
        required: ["id", "duration", "timeframe"],
    },
};
