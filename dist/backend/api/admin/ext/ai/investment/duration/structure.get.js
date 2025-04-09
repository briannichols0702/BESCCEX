"use strict";
// /api/admin/aiInvestmentDurations/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiInvestmentDurationStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for AI Investment Durations",
    operationId: "getAIInvestmentDurationStructure",
    tags: ["Admin", "AI Investment Durations"],
    responses: {
        200: {
            description: "Form structure for managing AI Investment Durations",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access AI Investment Duration Management",
};
const aiInvestmentDurationStructure = () => {
    const id = {
        type: "input",
        label: "ID",
        name: "id",
        placeholder: "Automatically generated",
        readOnly: true,
    };
    const duration = {
        type: "input",
        label: "Duration",
        name: "duration",
        placeholder: "Enter the duration number",
        ts: "number",
    };
    const timeframe = {
        type: "select",
        label: "Timeframe",
        name: "timeframe",
        options: [
            { value: "HOUR", label: "Hour" },
            { value: "DAY", label: "Day" },
            { value: "WEEK", label: "Week" },
            { value: "MONTH", label: "Month" },
        ],
        placeholder: "Select a timeframe",
    };
    return {
        id,
        duration,
        timeframe,
    };
};
exports.aiInvestmentDurationStructure = aiInvestmentDurationStructure;
exports.default = async () => {
    const { id, duration, timeframe } = (0, exports.aiInvestmentDurationStructure)();
    return {
        get: [duration, timeframe],
        set: [[duration, timeframe]],
    };
};
