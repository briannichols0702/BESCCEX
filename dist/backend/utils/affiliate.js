"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReferralRegister = exports.processRewards = void 0;
const db_1 = require("@b/db");
const notifications_1 = require("./notifications");
const logger_1 = require("@b/utils/logger");
const cache_1 = require("@b/utils/cache");
async function processRewards(userId, amount, conditionName, currency) {
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (!extensions.has("mlm"))
        return;
    const settings = await cacheManager.getSettings();
    const mlmSystem = settings.has("mlmSystem")
        ? settings.get("mlmSystem")
        : "DIRECT";
    let mlmSettings = null;
    try {
        mlmSettings = settings.has("mlmSettings")
            ? JSON.parse(settings.get("mlmSettings"))
            : null;
    }
    catch (error) {
        (0, logger_1.logError)("mlmSettings", error, __filename);
        return;
    }
    if (!mlmSettings) {
        (0, logger_1.logError)("mlmSettings", new Error("MLM settings not found"), __filename);
        return; // MLM settings not found
    }
    // Validate transaction type and currency
    if (!isValidTransaction(conditionName, amount, currency)) {
        (0, logger_1.logError)("transaction", new Error("Invalid transaction type or currency"), __filename);
        return;
    }
    const { mlmReferralCondition } = db_1.models;
    try {
        const condition = await mlmReferralCondition.findOne({
            where: { name: conditionName, status: true },
        });
        if (!condition) {
            (0, logger_1.logError)("condition", new Error("Invalid referral condition"), __filename);
            return;
        }
        let rewardsProcessed = false; // Flag to indicate if rewards were successfully processed
        switch (mlmSystem) {
            case "DIRECT":
                rewardsProcessed = await processDirectRewards(condition, userId, amount);
                break;
            case "BINARY":
                rewardsProcessed = await processBinaryRewards(condition, userId, amount, mlmSettings);
                break;
            case "UNILEVEL":
                rewardsProcessed = await processUnilevelRewards(condition, userId, amount, mlmSettings);
                break;
            default:
                (0, logger_1.logError)("mlmSystem", new Error("Invalid MLM system type"), __filename);
                break;
        }
        if (rewardsProcessed) {
            // Notify the user about their reward
            await (0, notifications_1.saveNotification)(userId, // Assuming userId is a string and needs to be converted to a number. Adjust as needed.
            "Reward Processed", `Your reward for ${conditionName} of ${amount} ${currency} has been successfully processed.`, NotificationType.SYSTEM);
            // Notify users with the "View MLM Rewards" permission about the reward process
            await (0, notifications_1.notifyUsersWithPermission)("View MLM Rewards", "MLM Reward Processed", `A reward for ${conditionName} of ${amount} ${currency} was processed for user ${userId}.`, NotificationType.SYSTEM);
        }
    }
    catch (error) {
        (0, logger_1.logError)("processRewards", error, __filename);
    }
}
exports.processRewards = processRewards;
function isValidTransaction(conditionName, amount, currency) {
    switch (conditionName) {
        case "WELCOME_BONUS":
            return currency === "USDT" && amount >= 100;
        case "MONTHLY_TRADE_VOLUME":
            return currency === "USDT" && amount > 1000;
        case "TRADE_COMMISSION":
        case "INVESTMENT":
        case "AI_INVESTMENT":
        case "FOREX_INVESTMENT":
        case "ICO_CONTRIBUTION":
        case "STAKING_LOYALTY":
        case "ECOMMERCE_PURCHASE":
        case "P2P_TRADE":
            return true;
        default:
            return false;
    }
}
async function processDirectRewards(condition, referredId, amount) {
    try {
        // Find the referral record
        const referral = await db_1.models.mlmReferral.findOne({
            where: { referredId },
        });
        if (!referral)
            return false;
        // Check for existing reward
        const count = await db_1.models.mlmReferralReward.count({
            where: {
                referrerId: referral.referrerId,
                conditionId: condition.id,
            },
        });
        if (count > 0)
            return false;
        // Calculate reward amount
        const rewardAmount = condition.rewardType === "PERCENTAGE"
            ? amount * (condition.reward / 100)
            : condition.reward;
        // Create the reward record
        await db_1.models.mlmReferralReward.create({
            referrerId: referral.referrerId,
            conditionId: condition.id,
            reward: rewardAmount,
        });
        return true;
    }
    catch (error) {
        (0, logger_1.logError)("processDirectRewards", error, __filename);
        return false;
    }
}
// Helper function to find uplines
async function findUplines(userId, systemType, levels) {
    const uplines = [];
    let currentUserId = userId;
    // Assume model names for binary and unilevel systems
    const model = systemType === "BINARY" ? db_1.models.mlmBinaryNode : db_1.models.mlmUnilevelNode;
    for (let i = 0; i < levels; i++) {
        try {
            const referral = await db_1.models.mlmReferral.findOne({
                where: { referredId: currentUserId },
                include: [
                    {
                        model: model,
                        as: systemType === "BINARY" ? "node" : "unilevelNode",
                        required: true,
                    },
                ],
            });
            if (!referral || !referral.referrerId) {
                (0, logger_1.logError)("findUplines", new Error(`User ${currentUserId} is not associated to ${systemType === "BINARY" ? "mlmBinaryNode" : "mlmUnilevelNode"}!`), __filename);
                break;
            }
            uplines.push({
                level: i + 1,
                referrerId: referral.referrerId,
            });
            currentUserId = referral.referrerId;
        }
        catch (error) {
            (0, logger_1.logError)("findUplines", error, __filename);
            break;
        }
    }
    return uplines;
}
// Common function to create reward record
async function createRewardRecord(referrerId, rewardAmount, conditionId) {
    try {
        await db_1.models.mlmReferralReward.create({
            referrerId,
            reward: rewardAmount,
            conditionId: conditionId,
        });
    }
    catch (error) {
        (0, logger_1.logError)("createRewardRecord", error, __filename);
    }
}
// Binary Rewards Processing
async function processBinaryRewards(condition, userId, depositAmount, mlmSettings) {
    var _a;
    try {
        // Check if mlmSettings.binary is a JSON string and parse it if necessary
        if (typeof mlmSettings.binary === "string") {
            try {
                mlmSettings.binary = JSON.parse(mlmSettings.binary);
            }
            catch (error) {
                (0, logger_1.logError)("mlmSettings.binary", new Error("Invalid JSON in mlmSettings.binary"), __filename);
                return false;
            }
        }
        if (!mlmSettings.binary || !mlmSettings.binary.levels) {
            (0, logger_1.logError)("mlmSettings", new Error("Binary MLM settings are invalid"), __filename);
            return false;
        }
        const binaryLevels = mlmSettings.binary.levels;
        const uplines = await findUplines(userId, "BINARY", binaryLevels);
        if (!uplines.length) {
            return false;
        }
        // Distribute rewards starting from the closest upline
        for (let i = uplines.length - 1; i >= 0; i--) {
            const upline = uplines[i];
            const levelIndex = binaryLevels - i; // Reverse the index for percentage lookup
            const levelRewardPercentage = (_a = mlmSettings.binary.levelsPercentage.find((l) => l.level === levelIndex)) === null || _a === void 0 ? void 0 : _a.value;
            if (levelRewardPercentage === undefined) {
                continue;
            }
            // Calculate base reward using the level's percentage
            const baseReward = depositAmount * (levelRewardPercentage / 100);
            // Then apply the condition's reward percentage to the base reward
            const finalReward = baseReward * (condition.reward / 100);
            await createRewardRecord(upline.referrerId, finalReward, condition.id);
        }
        return true;
    }
    catch (error) {
        (0, logger_1.logError)("processBinaryRewards", error, __filename);
        return false;
    }
}
// Unilevel Rewards Processing
async function processUnilevelRewards(condition, userId, depositAmount, mlmSettings) {
    var _a;
    try {
        // Check if mlmSettings.unilevel is a JSON string and parse it if necessary
        if (typeof mlmSettings.unilevel === "string") {
            try {
                mlmSettings.unilevel = JSON.parse(mlmSettings.unilevel);
            }
            catch (error) {
                (0, logger_1.logError)("mlmSettings.unilevel", new Error("Invalid JSON in mlmSettings.unilevel"), __filename);
                return false;
            }
        }
        if (!mlmSettings.unilevel || !mlmSettings.unilevel.levels) {
            (0, logger_1.logError)("mlmSettings", new Error("Unilevel MLM settings are invalid"), __filename);
            return false;
        }
        const unilevelLevels = mlmSettings.unilevel.levels;
        const uplines = await findUplines(userId, "UNILEVEL", unilevelLevels);
        if (!uplines.length) {
            return false;
        }
        // Distribute rewards starting from the closest upline
        for (let i = uplines.length - 1; i >= 0; i--) {
            const upline = uplines[i];
            const levelIndex = unilevelLevels - i; // Reverse the index for percentage lookup
            const levelRewardPercentage = (_a = mlmSettings.unilevel.levelsPercentage.find((l) => l.level === levelIndex)) === null || _a === void 0 ? void 0 : _a.value;
            if (levelRewardPercentage === undefined) {
                continue;
            }
            // Calculate base reward using the level's percentage
            const baseReward = depositAmount * (levelRewardPercentage / 100);
            // Then apply the condition's reward percentage to the base reward
            const finalReward = baseReward * (condition.reward / 100);
            await createRewardRecord(upline.referrerId, finalReward, condition.id);
        }
        return true;
    }
    catch (error) {
        (0, logger_1.logError)("processUnilevelRewards", error, __filename);
        return false;
    }
}
const handleReferralRegister = async (refId, userId) => {
    try {
        const referrer = await db_1.models.user.findByPk(refId);
        if (referrer) {
            const cacheManager = cache_1.CacheManager.getInstance();
            const settings = await cacheManager.getSettings();
            const referralApprovalRequired = settings.has("referralApprovalRequired")
                ? settings.get("referralApprovalRequired") === "true"
                : false;
            const referral = await db_1.models.mlmReferral.create({
                referrerId: referrer.id,
                referredId: userId,
                status: referralApprovalRequired ? "PENDING" : "ACTIVE",
            });
            const mlmSystem = settings.has("mlmSystem")
                ? settings.get("mlmSystem")
                : null;
            if (mlmSystem === "BINARY") {
                await handleBinaryMlmReferralRegister(referral.referrerId, referral.id, db_1.models.mlmBinaryNode);
            }
            else if (mlmSystem === "UNILEVEL") {
                await handleUnilevelMlmReferralRegister(referral.referrerId, referral.id, db_1.models.mlmUnilevelNode);
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("handleReferralRegister", error, __filename);
    }
};
exports.handleReferralRegister = handleReferralRegister;
const handleBinaryMlmReferralRegister = async (referrerId, referralId, mlmBinaryNode) => {
    try {
        // Find the referrer's binary node
        const referrerNode = await mlmBinaryNode.findOne({
            where: { referralId: referrerId },
        });
        // Determine placement: left or right
        const placement = referrerNode && referrerNode.leftChildId ? "rightChildId" : "leftChildId";
        // Create new node with parentId as referrerNode's id
        const newNode = await mlmBinaryNode.create({
            referralId: referralId,
            parentId: referrerNode ? referrerNode.id : null,
        });
        // Update referrerNode to set leftChildId or rightChildId to newNode.id
        if (referrerNode) {
            referrerNode[placement] = newNode.id;
            await referrerNode.save();
        }
    }
    catch (error) {
        (0, logger_1.logError)("handleBinaryMlmReferralRegister", error, __filename);
    }
};
const handleUnilevelMlmReferralRegister = async (referrerId, referralId, mlmUnilevelNode) => {
    try {
        // Correctly find the parent unilevel node based on the referral ID
        const referrerUnilevelNode = await mlmUnilevelNode.findOne({
            where: { referralId: referrerId },
        });
        // Create the new unilevel node with the correct parentId
        await mlmUnilevelNode.create({
            referralId: referralId,
            parentId: referrerUnilevelNode ? referrerUnilevelNode.id : null,
        });
    }
    catch (error) {
        (0, logger_1.logError)("handleUnilevelMlmReferralRegister", error, __filename);
    }
};
