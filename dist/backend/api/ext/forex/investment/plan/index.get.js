"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// endpoints/getForexPlans.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves all active Forex plans",
    description: "Fetches all active Forex plans available for investment.",
    operationId: "getForexPlans",
    tags: ["Forex", "Plans"],
    responses: {
        200: {
            description: "Forex plans retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseForexPlanSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Plan"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async () => {
    try {
        const plans = await db_1.models.forexPlan.findAll({
            where: { status: true },
            include: [
                {
                    model: db_1.models.forexDuration,
                    as: "durations",
                    attributes: ["id", "duration", "timeframe"],
                    through: { attributes: [] },
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
                "currency",
                "walletType",
                "trending",
            ],
        });
        return plans;
    }
    catch (error) {
        console.error("Error fetching forex plans:", error);
        throw error;
    }
};
