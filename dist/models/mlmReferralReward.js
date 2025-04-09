"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class mlmReferralReward extends sequelize_1.Model {
    static initModel(sequelize) {
        return mlmReferralReward.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            conditionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "conditionId: Condition ID must be a valid UUID",
                    },
                },
            },
            referrerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "referrerId: Referrer ID must be a valid UUID",
                    },
                },
            },
            reward: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "reward: Reward must be a valid number" },
                },
            },
            isClaimed: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            sequelize,
            modelName: "mlmReferralReward",
            tableName: "mlm_referral_reward",
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "mlmReferralRewardConditionIdFkey",
                    using: "BTREE",
                    fields: [{ name: "conditionId" }],
                },
                {
                    name: "mlmReferralRewardReferrerIdFkey",
                    using: "BTREE",
                    fields: [{ name: "referrerId" }],
                },
            ],
        });
    }
    static associate(models) {
        mlmReferralReward.belongsTo(models.mlmReferralCondition, {
            as: "condition", // The condition under which the reward is granted
            foreignKey: "conditionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        mlmReferralReward.belongsTo(models.user, {
            as: "referrer", // User who earned this reward
            foreignKey: "referrerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = mlmReferralReward;
