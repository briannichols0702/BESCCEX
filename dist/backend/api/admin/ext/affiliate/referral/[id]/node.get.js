"use strict";
// /api/mlmReferralConditions/structure.get.ts
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
    tags: ["Admin", "MLM", "Referrals"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "UUID of the node user" },
        },
    ],
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
    permission: "Access MLM Referral Management",
};
exports.default = async (data) => {
    const { params } = data;
    const { id } = params;
    const user = await db_1.models.user.findByPk(id, {
        include: [
            {
                model: db_1.models.mlmReferral,
                as: "referrer",
                include: [
                    {
                        model: db_1.models.user,
                        as: "referred",
                    },
                ],
            },
            {
                model: db_1.models.mlmReferral,
                as: "referred",
            },
        ],
    });
    if (!user) {
        throw (0, error_1.createError)({ statusCode: 404, message: "User not found" });
    }
    // Load settings from CacheManager
    const cacheManager = cache_1.CacheManager.getInstance();
    const settings = await cacheManager.getSettings();
    const mlmSettings = settings.has["mlmSettings"]
        ? JSON.parse(settings.has["mlmSettings"])
        : null;
    const mlmSystem = settings.has["mlmSystem"] || null;
    let nodeDetails;
    switch (mlmSystem) {
        case "DIRECT":
            nodeDetails = await (0, utils_1.listDirectReferrals)(user);
            break;
        case "BINARY":
            nodeDetails = await (0, utils_1.listBinaryReferrals)(user, mlmSettings);
            break;
        case "UNILEVEL":
            nodeDetails = await (0, utils_1.listUnilevelReferrals)(user, mlmSettings);
            break;
        default:
            nodeDetails = await (0, utils_1.listDirectReferrals)(user);
            break;
    }
    return nodeDetails;
};
