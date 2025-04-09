"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/ext/affiliate/utils");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Fetch MLM node details by UUID",
    description: "Retrieves information about a specific MLM node using its UUID.",
    operationId: "getNodeById",
    tags: ["MLM", "Referrals"],
    responses: {
        200: {
            description: "Node details retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "number", description: "User ID" },
                            firstName: { type: "string", description: "First name" },
                            lastName: { type: "string", description: "Last name" },
                            referrals: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "number", description: "Referral ID" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: {
            description: "Node not found",
        },
        500: {
            description: "Internal server error",
        },
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    // Corrected include statements with the right aliases
    const userPk = await db_1.models.user.findByPk(user.id, {
        include: [
            {
                model: db_1.models.mlmReferral,
                as: "referrerReferrals", // Correct alias for referrals where the user is the referrer
                include: [
                    {
                        model: db_1.models.user,
                        as: "referred", // Correct alias for the referred user in this referral
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "avatar",
                            "createdAt",
                            "status",
                        ],
                    },
                ],
            },
            {
                model: db_1.models.mlmReferral,
                as: "referredReferrals", // Correct alias for referrals where the user is the referred
                include: [
                    {
                        model: db_1.models.user,
                        as: "referrer", // Correct alias for the referrer user in this referral
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "avatar",
                            "createdAt",
                            "status",
                        ],
                    },
                ],
            },
            {
                model: db_1.models.mlmReferralReward,
                as: "referralRewards", // Correct alias for rewards associated with the user
                attributes: ["id"],
            },
        ],
    });
    if (!userPk) {
        throw (0, error_1.createError)({ statusCode: 404, message: "User not found" });
    }
    const cacheManager = cache_1.CacheManager.getInstance();
    const settings = await cacheManager.getSettings();
    const mlmSettings = settings.has("mlmSettings")
        ? JSON.parse(settings.get("mlmSettings"))
        : null;
    const mlmSystem = settings.has("mlmSystem")
        ? settings.get("mlmSystem")
        : null;
    let nodeDetails;
    switch (mlmSystem) {
        case "DIRECT":
            nodeDetails = await (0, utils_1.listDirectReferrals)(userPk);
            break;
        case "BINARY":
            nodeDetails = await (0, utils_1.listBinaryReferrals)(userPk, mlmSettings);
            break;
        case "UNILEVEL":
            nodeDetails = await (0, utils_1.listUnilevelReferrals)(userPk, mlmSettings);
            break;
        default:
            nodeDetails = await (0, utils_1.listDirectReferrals)(userPk);
            break;
    }
    return nodeDetails;
};
