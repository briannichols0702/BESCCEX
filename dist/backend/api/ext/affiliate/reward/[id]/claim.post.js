"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const wallet_1 = require("@b/utils/eco/wallet"); // Ensure this import is correct
exports.metadata = {
    summary: "Claims a specific referral reward",
    description: "Processes the claim of a specified referral reward.",
    operationId: "claimReward",
    tags: ["MLM", "Rewards"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Referral reward UUID" },
        },
    ],
    responses: {
        200: {
            description: "Reward claimed successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", description: "Success message" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Affiliate Reward"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, user } = data;
    const { id } = params;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const reward = await db_1.models.mlmReferralReward.findOne({
        where: { id, isClaimed: false },
        include: [{ model: db_1.models.mlmReferralCondition, as: "condition" }],
    });
    if (!reward)
        throw new Error("Reward not found or already claimed");
    if (reward.referrerId !== user.id)
        throw new Error("Unauthorized");
    let updatedWallet;
    // Handle ECO wallet creation logic differently
    if (reward.condition.rewardWalletType === "ECO") {
        // Utilize ecosystem-specific wallet retrieval/creation logic
        updatedWallet = await (0, wallet_1.getWalletByUserIdAndCurrency)(user.id, reward.condition.rewardCurrency);
    }
    else {
        // For non-ECO wallets, just find or create normally
        const wallet = await db_1.models.wallet.findOne({
            where: {
                userId: user.id,
                currency: reward.condition.rewardCurrency,
                type: reward.condition.rewardWalletType,
            },
        });
        if (!wallet) {
            updatedWallet = await db_1.models.wallet.create({
                userId: user.id,
                currency: reward.condition.rewardCurrency,
                type: reward.condition.rewardWalletType,
                status: true,
            });
        }
        else {
            updatedWallet = wallet;
        }
    }
    if (!updatedWallet)
        throw new Error("Wallet not found or could not be created");
    await db_1.sequelize.transaction(async (transaction) => {
        var _a;
        const newBalance = updatedWallet.balance + reward.reward;
        await updatedWallet.update({ balance: newBalance }, { transaction });
        await reward.update({ isClaimed: true }, { transaction });
        await db_1.models.transaction.create({
            userId: user.id,
            walletId: updatedWallet.id,
            type: "REFERRAL_REWARD",
            status: "COMPLETED",
            amount: reward.reward,
            description: `Claimed referral reward for ${(_a = reward.condition) === null || _a === void 0 ? void 0 : _a.type}`,
            metadata: JSON.stringify({ rewardId: reward.id }),
        }, { transaction });
    });
    return { message: "Reward claimed successfully" };
};
