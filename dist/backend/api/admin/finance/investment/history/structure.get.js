"use strict";
// /api/admin/investments/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.investmentStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
const lodash_1 = require("lodash");
exports.metadata = {
    summary: "Get form structure for Investments",
    operationId: "getInvestmentStructure",
    tags: ["Admin", "Investments"],
    responses: {
        200: {
            description: "Form structure for managing Investments",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Investment Management"
};
const investmentStructure = async () => {
    const plans = await db_1.models.investmentPlan.findAll({
        where: { status: true },
    });
    const durations = await db_1.models.investmentDuration.findAll();
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const planId = {
        type: "select",
        label: "Plan ID",
        name: "planId",
        options: plans.map((plan) => ({
            value: plan.id,
            label: plan.title,
        })),
        placeholder: "Select plan",
    };
    const durationId = {
        type: "select",
        label: "Duration ID",
        name: "durationId",
        options: durations.map((duration) => ({
            value: duration.id,
            label: `${duration.duration} ${(0, lodash_1.capitalize)(duration.timeframe)}`,
        })),
        placeholder: "Select duration",
    };
    const amount = {
        type: "input",
        label: "Amount",
        name: "amount",
        placeholder: "Enter investment amount",
        ts: "number",
    };
    const profit = {
        type: "input",
        label: "Profit",
        name: "profit",
        placeholder: "Enter profit amount",
        ts: "number",
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
        placeholder: "Select result",
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
    // TODO: edit mode not setting default value
    const endDate = {
        type: "datetime",
        label: "End Date",
        name: "endDate",
        placeholder: "Select end date",
    };
    return {
        userId,
        planId,
        durationId,
        amount,
        profit,
        result,
        status,
        endDate,
    };
};
exports.investmentStructure = investmentStructure;
exports.default = async () => {
    const { userId, planId, durationId, amount, profit, result, status, endDate, } = await (0, exports.investmentStructure)();
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
            [amount, profit],
            [result, endDate],
            status,
        ],
        set: [
            userId,
            [planId, durationId],
            [amount, profit],
            [result, endDate],
            status,
        ],
    };
};
