"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves a specific stake for the logged-in user",
    description: "Fetches details of a specific stake by ID for the logged-in user.",
    operationId: "getStakeById",
    tags: ["Staking", "User Stakes"],
    requiresAuth: true,
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Stake ID" },
        },
    ],
    responses: {
        200: {
            description: "Stake retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseStakeSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Stake"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params, user } = data;
    const { id } = params;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const stake = await db_1.models.stakingLog.findOne({
        where: { id, userId: user.id },
        include: [{ model: db_1.models.stakingPool, as: "pool" }],
    });
    if (!stake) {
        throw (0, error_1.createError)({ statusCode: 404, message: "Stake not found" });
    }
    return stake;
};
