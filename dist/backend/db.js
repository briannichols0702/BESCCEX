"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = exports.sequelize = exports.db = exports.SequelizeSingleton = void 0;
const sequelize_1 = require("sequelize");
const init_1 = require("@db/init");
const worker_threads_1 = require("worker_threads");
class SequelizeSingleton {
    constructor() {
        this.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: "mysql",
            port: Number(process.env.DB_PORT),
            logging: false,
            dialectOptions: {
                charset: "utf8mb4",
            },
            define: {
                charset: "utf8mb4",
                collate: "utf8mb4_unicode_ci",
            },
        });
        this.models = this.initModels();
        // Only sync on the main thread
        if (worker_threads_1.isMainThread) {
            this.syncDatabase();
            console.log(`\x1b[36mMain Thread: Database synced successfully...\x1b[0m`);
        }
    }
    static getInstance() {
        if (!SequelizeSingleton.instance) {
            SequelizeSingleton.instance = new SequelizeSingleton();
        }
        return SequelizeSingleton.instance;
    }
    getSequelize() {
        return this.sequelize;
    }
    initModels() {
        const models = (0, init_1.initModels)(this.sequelize);
        return models;
    }
    async syncDatabase() {
        try {
            await this.sequelize.sync({ alter: true });
        }
        catch (error) {
            console.error("Database sync failed:", error);
            throw error;
        }
    }
}
exports.SequelizeSingleton = SequelizeSingleton;
exports.db = SequelizeSingleton.getInstance();
exports.sequelize = exports.db.getSequelize();
exports.models = exports.db.models;
exports.default = exports.db;
