"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class permission extends sequelize_1.Model {
    static initModel(sequelize) {
        return permission.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "name: Name cannot be empty" },
                },
            },
        }, {
            sequelize,
            modelName: "permission",
            tableName: "permission",
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
    static associate(models) {
        permission.hasMany(models.rolePermission, {
            as: "rolePermissions",
            foreignKey: "permissionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        permission.belongsToMany(models.role, {
            through: models.rolePermission,
            as: "roles",
            foreignKey: "permissionId",
            otherKey: "roleId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = permission;
