"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Retrieves all Forex investments for the logged-in user",
    description: "Fetches all Forex investments linked to the currently authenticated user.",
    operationId: "getAllForexInvestments",
    tags: ["Forex", "Investments"],
    responses: {
        200: {
            description: "Forex investments retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseForexInvestmentSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Investment"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const investments = await db_1.models.forexInvestment.findAll({
        where: { userId: user.id },
        include: [
            {
                model: db_1.models.forexPlan,
                as: "plan",
                attributes: [
                    "id",
                    "name",
                    "title",
                    "description",
                    "profitPercentage",
                    "image",
                ],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["id", "avatar", "firstName", "lastName"],
            },
            {
                model: db_1.models.forexDuration,
                as: "duration",
                attributes: ["id", "duration", "timeframe"],
            },
        ],
    });
    return investments;
};
