"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class currency extends sequelize_1.Model {
    static initModel(sequelize) {
        return currency.init({
            id: {
                type: sequelize_1.DataTypes.STRING(191),
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "name: Name must not be empty" },
                },
            },
            symbol: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "symbol: Symbol must not be empty" },
                },
            },
            precision: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "precision: Precision must be a valid number" },
                    min: { args: [0], msg: "precision: Precision cannot be negative" },
                },
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                validate: {
                    isFloat: { msg: "price: Price must be a valid number" },
                    min: { args: [0], msg: "price: Price cannot be negative" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                validate: {
                    notNull: { msg: "status: Status cannot be null" },
                },
            },
        }, {
            sequelize,
            modelName: "currency",
            tableName: "currency",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
            ],
        });
    }
    static associate(models) { }
}
exports.default = currency;
