"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class wallet extends sequelize_1.Model {
    static initModel(sequelize) {
        return wallet.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    notNull: { msg: "userId: User ID cannot be null" },
                    isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("FIAT", "SPOT", "ECO", "FUTURES"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["FIAT", "SPOT", "ECO", "FUTURES"]],
                        msg: "type: Type must be one of ['FIAT', 'SPOT', 'ECO', 'FUTURES']",
                    },
                },
            },
            currency: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "currency: Currency cannot be empty" },
                },
            },
            balance: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "balance: Balance must be a number" },
                },
            },
            inOrder: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
            },
            address: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const rawData = this.getDataValue("address");
                    // Parse the JSON string back into an object
                    return rawData ? JSON.parse(rawData) : null;
                },
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                validate: {
                    isBoolean: { msg: "status: Status must be a boolean value" },
                },
            },
        }, {
            sequelize,
            modelName: "wallet",
            tableName: "wallet",
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
                    name: "walletIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "walletUserIdCurrencyTypeKey",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "userId" },
                        { name: "currency" },
                        { name: "type" },
                    ],
                },
            ],
        });
    }
    static associate(models) {
        wallet.hasMany(models.ecosystemPrivateLedger, {
            as: "ecosystemPrivateLedgers",
            foreignKey: "walletId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        wallet.hasMany(models.ecosystemUtxo, {
            as: "ecosystemUtxos",
            foreignKey: "walletId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        wallet.hasMany(models.paymentIntent, {
            as: "paymentIntents",
            foreignKey: "walletId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        wallet.hasMany(models.transaction, {
            as: "transactions",
            foreignKey: "walletId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        wallet.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        wallet.hasMany(models.walletData, {
            as: "walletData",
            foreignKey: "walletId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = wallet;
