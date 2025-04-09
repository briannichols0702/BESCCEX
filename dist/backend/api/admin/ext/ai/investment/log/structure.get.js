"use strict";
// /api/admin/aiInvestments/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiInvestmentStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Get form structure for AI Investments",
    operationId: "getAIInvestmentStructure",
    tags: ["Admin", "AI Investments"],
    responses: {
        200: {
            description: "Form structure for managing AI Investments",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access AI Investment Management",
};
const aiInvestmentStructure = async () => {
    const plans = await db_1.models.aiInvestmentPlan.findAll();
    const durations = await db_1.models.aiInvestmentDuration.findAll();
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const planId = {
        type: "select",
        label: "Investment Plan",
        name: "planId",
        options: plans.map((plan) => ({
            value: plan.id,
            label: plan.title,
        })),
        placeholder: "Select an investment plan",
    };
    const durationId = {
        type: "select",
        label: "Duration",
        name: "durationId",
        options: durations.map((duration) => ({
            value: duration.id,
            label: duration.duration + " " + duration.timeframe,
        })),
        placeholder: "Select a duration",
    };
    const symbol = {
        type: "input",
        label: "Market",
        name: "symbol",
        placeholder: "Enter the symbol",
    };
    const amount = {
        type: "input",
        label: "Investment Amount",
        name: "amount",
        placeholder: "Enter the amount",
        ts: "number",
    };
    const profit = {
        type: "input",
        label: "Profit",
        name: "profit",
        placeholder: "Enter the profit",
        ts: "number",
        nullable: true,
    };
    const result = {
        type: "select",
        label: "Result",
        name: "result",
        options: [
            { value: "WIN", label: "Win" },
            { value: "LOSS", label: "Loss" },
            { value: "DRAW", label: "Draw" },
        ],
        placeholder: "Select a result",
        nullable: true,
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "ACTIVE", label: "Active" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
            { value: "REJECTED", label: "Rejected" },
        ],
        placeholder: "Select status",
    };
    const type = {
        type: "select",
        label: "Wallet Type",
        name: "type",
        options: [{ value: "SPOT", label: "Spot" }],
        placeholder: "Select a wallet type",
    };
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (extensions.has("ecosystem")) {
        type.options.push({ value: "ECO", label: "Funding" });
    }
    return {
        userId,
        planId,
        durationId,
        symbol,
        amount,
        profit,
        result,
        status,
        type,
    };
};
exports.aiInvestmentStructure = aiInvestmentStructure;
exports.default = async () => {
    const { userId, planId, durationId, symbol, amount, profit, result, status, type, } = await (0, exports.aiInvestmentStructure)();
    return {
        get: [
            {
                fields: [
                    structure_1.userAvatarSchema,
                    {
                        fields: [
                            structure_1.userFullNameSchema,
                            {
                                type: "input",
                                component: "InfoBlock",
                                label: "Plan Title",
                                name: "plan.title",
                                icon: "ph:wallet-light",
                            },
                            {
                                type: "input",
                                component: "InfoBlock",
                                label: "Duration",
                                name: "duration.duration,' ',duration.timeframe",
                                icon: "ph:currency-circle-dollar-light",
                            },
                        ],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-5 items-center",
            },
            symbol,
            [amount, profit],
            result,
            [type, status],
        ],
        set: [
            [userId, symbol],
            durationId,
            [planId, amount],
            [profit, result],
            [type, status],
        ],
    };
};
