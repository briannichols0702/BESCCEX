"use strict";
// /server/api/admin/users/analytics/all.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const chart_1 = require("@b/utils/chart");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Gets chart data for user analytics",
    operationId: "getAnalyticsData",
    tags: ["Finance", "Transactions"],
    parameters: [
        {
            name: "timeframe",
            in: "query",
            description: "Timeframe for the data",
            schema: {
                type: "string",
                enum: ["h", "d", "w", "m", "3m", "6m", "y"],
                default: "m",
            },
        },
        {
            name: "filter",
            in: "query",
            description: "Filter for the data",
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        availableFilters: {
                            type: "object",
                            additionalProperties: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        value: { type: "string" },
                                        label: { type: "string" },
                                        color: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Analytics data of user counts per day",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            chartData: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        date: { type: "string" },
                                        count: { type: "number" },
                                    },
                                },
                            },
                            filterResults: {
                                type: "object",
                                additionalProperties: {
                                    type: "object",
                                    properties: {
                                        count: { type: "number" },
                                        change: { type: "number" },
                                        percentage: { type: "number" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: { description: "Unauthorized access" },
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { query, body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized access");
    const { walletType, currency, filter, timeframe } = query;
    const { availableFilters } = body;
    if (!walletType && !currency)
        throw (0, error_1.createError)(400, "Invalid request");
    const wallet = await db_1.models.wallet.findOne({
        where: { type: walletType, currency, userId: user.id },
    });
    if (!wallet)
        throw (0, error_1.createError)(404, "Wallet not found");
    const where = { walletId: wallet.id };
    return (0, chart_1.getChartData)({
        model: db_1.models.transaction,
        timeframe,
        filter,
        availableFilters,
        where,
    });
};
