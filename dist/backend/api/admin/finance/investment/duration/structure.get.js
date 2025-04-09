"use strict";
// /api/admin/investmentDurations/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.investmentDurationStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Investment Durations",
    operationId: "getInvestmentDurationStructure",
    tags: ["Admin", "Investment Durations"],
    responses: {
        200: {
            description: "Form structure for managing Investment Durations",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Investment Duration Management"
};
const investmentDurationStructure = () => {
    const duration = {
        type: "input",
        label: "Duration",
        name: "duration",
        placeholder: "Enter duration number",
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
        duration,
        timeframe,
    };
};
exports.investmentDurationStructure = investmentDurationStructure;
exports.default = () => {
    const { duration, timeframe } = (0, exports.investmentDurationStructure)();
    return {
        get: [duration, timeframe],
        set: [[duration, timeframe]],
    };
};
