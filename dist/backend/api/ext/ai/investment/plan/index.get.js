"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Retrieves all active AI trading plans",
    description: "Fetches all active AI trading plans available for users to invest in, including details about each plan and its associated durations.",
    operationId: "getAiTradingPlans",
    tags: ["AI Trading Plans"],
    responses: {
        200: {
            description: "AI trading plans retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseTradingPlanSchema,
                            required: [
                                "id",
                                "title",
                                "description",
                                "minAmount",
                                "maxAmount",
                                "status",
                            ],
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("AI Investment Plan"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const plans = await db_1.models.aiInvestmentPlan.findAll({
        where: { status: true },
        include: [
            {
                model: db_1.models.aiInvestmentDuration,
                as: "durations",
                through: { attributes: [] },
                attributes: ["id", "duration", "timeframe"],
            },
        ],
        attributes: [
            "id",
            "title",
            "description",
            "image",
            "minAmount",
            "maxAmount",
            "profitPercentage",
            "invested",
            "trending",
            "status",
        ],
    });
    return plans;
};
