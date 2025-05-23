"use strict";
// /api/admin/investmentPlans/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.investmentPlanStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
exports.metadata = {
    summary: "Get form structure for AI Investment Plans",
    operationId: "getAIInvestmentPlanStructure",
    tags: ["Admin", "AI Investment Plans"],
    responses: {
        200: {
            description: "Form structure for managing AI Investment Plans",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access AI Investment Plan Management",
};
const investmentPlanStructure = async () => {
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        placeholder: "Enter the name of the plan",
    };
    const title = {
        type: "input",
        label: "Title",
        name: "title",
        component: "InfoBlock",
        icon: "material-symbols-light:title",
        placeholder: "Enter the title of the plan",
    };
    const description = {
        type: "textarea",
        label: "Description",
        name: "description",
        placeholder: "Enter a description for the plan",
    };
    const minProfit = {
        type: "input",
        label: "Minimum Profit",
        name: "minProfit",
        placeholder: "Minimum expected profit",
        ts: "number",
    };
    const maxProfit = {
        type: "input",
        label: "Maximum Profit",
        name: "maxProfit",
        placeholder: "Maximum expected profit",
        ts: "number",
    };
    const minAmount = {
        type: "input",
        label: "Minimum Amount",
        name: "minAmount",
        placeholder: "Minimum investable amount",
        ts: "number",
    };
    const maxAmount = {
        type: "input",
        label: "Maximum Amount",
        name: "maxAmount",
        placeholder: "Maximum investable amount",
        ts: "number",
    };
    const invested = {
        type: "input",
        label: "Invested",
        name: "invested",
        placeholder: "Total invested amount",
        ts: "number",
    };
    const profitPercentage = {
        type: "input",
        label: "Profit Percentage",
        name: "profitPercentage",
        placeholder: "Profit percentage of the plan",
        ts: "number",
    };
    const defaultProfit = {
        type: "input",
        label: "Default Profit",
        name: "defaultProfit",
        placeholder: "Default profit for calculations",
        ts: "number",
    };
    const defaultResult = {
        type: "select",
        label: "Default Result",
        name: "defaultResult",
        options: [
            { value: "WIN", label: "Win" },
            { value: "LOSS", label: "Loss" },
            { value: "DRAW", label: "Draw" },
        ],
        placeholder: "Default result for the plan",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        placeholder: "Select the status of the plan",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    const trending = {
        type: "select",
        label: "Trending",
        name: "trending",
        placeholder: "Is the plan trending?",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    const durations = await db_1.models.aiInvestmentDuration.findAll({
        attributes: ["id", "duration", "timeframe"],
    });
    const durationIds = {
        type: "select",
        label: "Durations",
        name: "durations",
        multiple: true,
        structure: {
            value: "id",
            label: "duration.' '.timeframe",
        },
        options: durations.map((d) => ({
            value: d.id,
            label: `${d.duration} ${d.timeframe}`,
        })),
        placeholder: "Select the durations for the plan",
    };
    return {
        name,
        title,
        description,
        minProfit,
        maxProfit,
        minAmount,
        maxAmount,
        invested,
        profitPercentage,
        status,
        defaultProfit,
        defaultResult,
        trending,
        durationIds,
    };
};
exports.investmentPlanStructure = investmentPlanStructure;
exports.default = async () => {
    const { name, title, description, minProfit, maxProfit, minAmount, maxAmount, invested, profitPercentage, status, defaultProfit, defaultResult, trending, durationIds, } = await (0, exports.investmentPlanStructure)();
    return {
        get: [
            {
                fields: [
                    {
                        ...structure_1.imageStructure,
                        width: structure_1.imageStructure.width / 4,
                        height: structure_1.imageStructure.width / 4,
                    },
                    {
                        fields: [title],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-3 items-center",
            },
            description,
            [minProfit, maxProfit],
            [minAmount, maxAmount],
            [invested, profitPercentage],
            [defaultProfit, defaultResult],
            {
                type: "tags",
                label: "Durations",
                name: "durations",
            },
            [trending, status],
        ],
        set: [
            structure_1.imageStructure,
            [name, title],
            description,
            [minProfit, maxProfit],
            [minAmount, maxAmount],
            [invested, profitPercentage],
            [defaultProfit, defaultResult],
            durationIds,
            [status, trending],
        ],
    };
};
