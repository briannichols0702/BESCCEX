"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBinaryReferrals = exports.listUnilevelReferrals = exports.listDirectReferrals = exports.baseReferralSchema = void 0;
const db_1 = require("@b/db");
const schema_1 = require("@b/utils/schema");
const sequelize_1 = require("sequelize");
exports.baseReferralSchema = {
    id: (0, schema_1.baseStringSchema)("Referral ID"),
    referredId: (0, schema_1.baseStringSchema)("Referred user UUID"),
    referrerId: (0, schema_1.baseStringSchema)("Referrer user UUID"),
    createdAt: (0, schema_1.baseStringSchema)("Date of referral"),
};
async function listDirectReferrals(user) {
    var _a, _b, _c;
    const referrerId = user.id;
    const referrals = (await db_1.models.mlmReferral.findAll({
        where: { referrerId },
        include: [
            {
                model: db_1.models.user,
                as: "referred",
                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "avatar",
                    "createdAt",
                    "status",
                ],
                include: [
                    {
                        model: db_1.models.mlmReferral,
                        as: "referrerReferrals",
                        attributes: ["id"],
                    },
                ],
            },
            {
                model: db_1.models.user,
                as: "referrer",
                include: [
                    {
                        model: db_1.models.mlmReferralReward,
                        as: "referralRewards",
                        attributes: ["id"],
                    },
                ],
            },
        ],
    }));
    const downlines = referrals.map((referral) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return ({
            id: (_a = referral.referred) === null || _a === void 0 ? void 0 : _a.id,
            firstName: (_b = referral.referred) === null || _b === void 0 ? void 0 : _b.firstName,
            lastName: (_c = referral.referred) === null || _c === void 0 ? void 0 : _c.lastName,
            avatar: (_d = referral.referred) === null || _d === void 0 ? void 0 : _d.avatar,
            createdAt: (_e = referral.referred) === null || _e === void 0 ? void 0 : _e.createdAt,
            status: (_f = referral.referred) === null || _f === void 0 ? void 0 : _f.status,
            level: 2,
            rewardsCount: 0,
            referredCount: ((_h = (_g = referral.referred) === null || _g === void 0 ? void 0 : _g.referrerReferrals) === null || _h === void 0 ? void 0 : _h.length) || 0,
            downlines: [],
        });
    });
    const rootUserRewardsCount = ((_c = (_b = (_a = referrals[0]) === null || _a === void 0 ? void 0 : _a.referrer) === null || _b === void 0 ? void 0 : _b.referralRewards) === null || _c === void 0 ? void 0 : _c.length) || 0;
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        createdAt: user.createdAt,
        status: user.status,
        level: 1,
        rewardsCount: rootUserRewardsCount,
        referredCount: referrals.length,
        downlines,
    };
}
exports.listDirectReferrals = listDirectReferrals;
async function listUnilevelReferrals(user, mlmSettings) {
    const userId = user.id;
    const directReferrals = user.referrerReferrals || [];
    const rootUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        createdAt: user.createdAt,
        status: user.status,
        level: 1,
        rewardsCount: await db_1.models.mlmReferralReward.count({
            where: { referrerId: userId },
        }),
        referredCount: directReferrals.length,
        downlines: [],
    };
    const processedIds = new Set([user.id]);
    async function buildDownlines(referrals, level) {
        var _a;
        if (level > mlmSettings.unilevel.levels || !referrals.length)
            return [];
        const downlines = [];
        for (const referral of referrals) {
            const referredUser = referral.referred;
            if (processedIds.has(referredUser.id))
                continue;
            processedIds.add(referredUser.id);
            const nextLevelReferrals = await db_1.models.mlmReferral.findAll({
                where: { referrerId: referredUser.id },
                include: [
                    {
                        model: db_1.models.user,
                        as: "referred",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "avatar",
                            "createdAt",
                            "status",
                        ],
                        include: [
                            {
                                model: db_1.models.mlmReferralReward,
                                as: "referralRewards",
                                attributes: ["id"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            const downline = {
                id: referredUser.id,
                firstName: referredUser.firstName,
                lastName: referredUser.lastName,
                avatar: referredUser.avatar,
                createdAt: referredUser.createdAt,
                status: referredUser.status,
                level,
                rewardsCount: ((_a = referredUser.referralRewards) === null || _a === void 0 ? void 0 : _a.length) || 0,
                referredCount: nextLevelReferrals.length,
                downlines: await buildDownlines(nextLevelReferrals, level + 1),
            };
            downlines.push(downline);
        }
        return downlines;
    }
    rootUser.downlines = await buildDownlines(directReferrals, 2);
    return rootUser;
}
exports.listUnilevelReferrals = listUnilevelReferrals;
async function listBinaryReferrals(user, mlmSettings) {
    const referrerId = user.id;
    const rootNode = await db_1.models.mlmBinaryNode.findOne({
        where: { referralId: referrerId },
        attributes: ["id"],
        raw: true,
    });
    if (!rootNode) {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            createdAt: user.createdAt,
            status: user.status,
            level: 1,
            rewardsCount: 0,
            referredCount: 0,
            downlines: [],
        };
    }
    const processedIds = new Set([user.id]);
    async function fetchBinaryDownlines(nodeIds, level = 2) {
        var _a, _b;
        if (level > mlmSettings.binary.levels)
            return [];
        const nodes = (await db_1.models.mlmBinaryNode.findAll({
            where: { parentId: { [sequelize_1.Op.in]: nodeIds } },
            include: [
                {
                    model: db_1.models.mlmReferral,
                    as: "referral",
                    include: [
                        {
                            model: db_1.models.user,
                            as: "referred",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "avatar",
                                "createdAt",
                                "status",
                            ],
                            include: [
                                {
                                    model: db_1.models.mlmReferralReward,
                                    as: "referralRewards",
                                    attributes: ["id"],
                                },
                                {
                                    model: db_1.models.mlmReferral,
                                    as: "referrerReferrals",
                                    attributes: ["id"],
                                },
                            ],
                        },
                    ],
                },
                { model: db_1.models.mlmBinaryNode, as: "leftChild", attributes: ["id"] },
                { model: db_1.models.mlmBinaryNode, as: "rightChild", attributes: ["id"] },
            ],
            raw: true,
            nest: true,
        }));
        const downlines = [];
        for (const node of nodes) {
            const referredUser = node.referral.referred;
            if (processedIds.has(referredUser.id))
                continue;
            processedIds.add(referredUser.id);
            const leftDownlines = node.leftChild
                ? await fetchBinaryDownlines([node.leftChild.id], level + 1)
                : [];
            const rightDownlines = node.rightChild
                ? await fetchBinaryDownlines([node.rightChild.id], level + 1)
                : [];
            downlines.push({
                id: referredUser.id,
                firstName: referredUser.firstName,
                lastName: referredUser.lastName,
                avatar: referredUser.avatar,
                createdAt: referredUser.createdAt,
                status: referredUser.status,
                level,
                rewardsCount: ((_a = referredUser.referralRewards) === null || _a === void 0 ? void 0 : _a.length) || 0,
                referredCount: ((_b = referredUser.referrerReferrals) === null || _b === void 0 ? void 0 : _b.length) || 0,
                downlines: [...leftDownlines, ...rightDownlines],
            });
        }
        return downlines;
    }
    const topLevelDownlines = await fetchBinaryDownlines([rootNode.id], 2);
    const rootUserRewardsCount = await db_1.models.mlmReferralReward.count({
        where: { referrerId },
    });
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        createdAt: user.createdAt,
        status: user.status,
        level: 1,
        rewardsCount: rootUserRewardsCount,
        referredCount: topLevelDownlines.reduce((acc, line) => acc + line.referredCount, 0),
        downlines: topLevelDownlines,
    };
}
exports.listBinaryReferrals = listBinaryReferrals;
