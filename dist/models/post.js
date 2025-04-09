"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class post extends sequelize_1.Model {
    static initModel(sequelize) {
        return post.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "title: Title cannot be empty" },
                },
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "content: Content cannot be empty" },
                },
            },
            categoryId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "categoryId: Category ID must be a valid UUID",
                    },
                },
            },
            authorId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "authorId: Author ID must be a valid UUID",
                    },
                },
            },
            slug: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: "postSlugKey",
                validate: {
                    notEmpty: { msg: "slug: Slug cannot be empty" },
                },
            },
            description: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PUBLISHED", "DRAFT"),
                allowNull: false,
                defaultValue: "DRAFT",
                validate: {
                    isIn: {
                        args: [["PUBLISHED", "DRAFT"]],
                        msg: "status: Status must be either PUBLISHED, or DRAFT",
                    },
                },
            },
            image: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "post",
            tableName: "post",
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
                    name: "postSlugKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "slug" }],
                },
                {
                    name: "postsCategoryIdForeign",
                    using: "BTREE",
                    fields: [{ name: "categoryId" }],
                },
                {
                    name: "postsAuthorIdForeign",
                    using: "BTREE",
                    fields: [{ name: "authorId" }],
                },
            ],
        });
    }
    static associate(models) {
        post.belongsTo(models.author, {
            as: "author",
            foreignKey: "authorId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        post.belongsTo(models.category, {
            as: "category",
            foreignKey: "categoryId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        post.hasMany(models.comment, {
            as: "comments",
            foreignKey: "postId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        post.hasMany(models.postTag, {
            as: "postTags",
            foreignKey: "postId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        post.belongsToMany(models.tag, {
            through: models.postTag,
            as: "tags",
            foreignKey: "postId",
            otherKey: "tagId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = post;
