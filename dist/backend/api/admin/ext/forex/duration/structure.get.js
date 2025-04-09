"use strict";
// /api/admin/forexDurations/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.forexDurationStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Forex Durations",
    operationId: "getForexDurationStructure",
    tags: ["Admin", "Forex Durations"],
    responses: {
        200: {
            description: "Form structure for managing Forex Durations",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Forex Duration Management",
};
const forexDurationStructure = () => {
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
exports.forexDurationStructure = forexDurationStructure;
exports.default = () => {
    const { duration, timeframe } = (0, exports.forexDurationStructure)();
    return {
        get: [duration, timeframe],
        set: [[duration, timeframe]],
    };
};
