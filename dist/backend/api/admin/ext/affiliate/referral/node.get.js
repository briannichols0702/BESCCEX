"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Fetch all MLM binary nodes",
    description: "Retrieves all nodes associated with MLM binary referrals.",
    operationId: "getAllNodes",
    tags: ["Admin", "MLM", "Referrals"],
    responses: {
        200: {
            description: "Nodes retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "number", description: "User ID" },
                                firstName: { type: "string", description: "First name" },
                                lastName: { type: "string", description: "Last name" },
                                avatar: { type: "string", description: "User avatar URL" },
                                binaryReferralCount: {
                                    type: "number",
                                    description: "Number of binary referrals",
                                },
                            },
                        },
                    },
                },
            },
        },
        500: {
            description: "Internal server error",
        },
    },
    permission: "Access MLM Referral Management",
};
exports.default = async () => {
    const users = (await db_1.models.user.findAll({
        include: [
            {
                model: db_1.models.mlmReferral,
                as: "referrals",
                where: {
                    mlmBinaryNode: { [sequelize_1.Op.ne]: null },
                },
            },
        ],
    }));
    const usersWithReferralCount = users.map((user) => ({
        ...user,
        binaryReferralCount: user.referrals.length,
    }));
    return usersWithReferralCount;
};
