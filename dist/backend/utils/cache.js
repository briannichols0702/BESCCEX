"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const db_1 = require("@b/db"); // Adjust import path as needed
const redis_1 = require("./redis");
const logger_1 = __importDefault(require("@b/utils/logger"));
const redis = redis_1.RedisSingleton.getInstance();
class CacheManager {
    // Private constructor to prevent direct instantiation
    constructor() {
        this.settingsKey = "settings";
        this.extensionsKey = "extensions";
        // Maps to store settings and extensions for quick access
        this.settings = new Map();
        this.extensions = new Map();
    }
    // Public method to provide access to the singleton instance
    static getInstance() {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }
    // Load settings from Map, Redis, or DB if necessary
    async getSettings() {
        if (this.settings.size === 0) {
            try {
                const cachedSettings = await this.getCache(this.settingsKey);
                if (Object.keys(cachedSettings).length > 0) {
                    this.settings = new Map(Object.entries(cachedSettings));
                }
                else {
                    await this.loadSettingsFromDB();
                }
            }
            catch (error) {
                (0, logger_1.default)("error", "CacheManager", __filename, `Failed to load settings: ${error.message}`);
                throw error;
            }
        }
        return this.settings;
    }
    // Load extensions from Map, Redis, or DB if necessary
    async getExtensions() {
        if (this.extensions.size === 0) {
            try {
                const cachedExtensions = await this.getCache(this.extensionsKey);
                if (Object.keys(cachedExtensions).length > 0) {
                    this.extensions = new Map(Object.entries(cachedExtensions));
                }
                else {
                    await this.loadExtensionsFromDB();
                }
            }
            catch (error) {
                (0, logger_1.default)("error", "CacheManager", __filename, `Failed to load extensions: ${error.message}`);
                throw error;
            }
        }
        return this.extensions;
    }
    // Get a specific setting from the Map
    async getSetting(key) {
        const settings = await this.getSettings();
        return settings.get(key);
    }
    // Update a setting in both the Map and Redis cache, and optionally sync to DB
    async updateSetting(key, value, syncToDB = false) {
        this.settings.set(key, value);
        await redis.hset(this.settingsKey, key, JSON.stringify(value));
        if (syncToDB) {
            await db_1.models.settings.upsert({ key, value });
        }
    }
    // Update an extension in both the Map and Redis cache, and optionally sync to DB
    async updateExtension(name, data, syncToDB = false) {
        this.extensions.set(name, data);
        await redis.hset(this.extensionsKey, name, JSON.stringify(data));
        if (syncToDB) {
            await db_1.models.extension.upsert({ name, ...data });
        }
    }
    // Load settings from DB, populate Map, and update Redis cache
    async loadSettingsFromDB() {
        const settingsData = await db_1.models.settings.findAll();
        const pipeline = redis.pipeline();
        settingsData.forEach((setting) => {
            this.settings.set(setting.key, setting.value);
            pipeline.hset(this.settingsKey, setting.key, JSON.stringify(setting.value));
        });
        await pipeline.exec();
    }
    // Load extensions from DB, populate Map, and update Redis cache
    async loadExtensionsFromDB() {
        const extensionsData = await db_1.models.extension.findAll({
            where: { status: true },
        });
        const pipeline = redis.pipeline();
        extensionsData.forEach((extension) => {
            this.extensions.set(extension.name, extension);
            pipeline.hset(this.extensionsKey, extension.name, JSON.stringify(extension));
        });
        await pipeline.exec();
    }
    // Helper method to retrieve all data from Redis cache and parse it into an object
    async getCache(key) {
        const cachedData = await redis.hgetall(key);
        return Object.keys(cachedData).reduce((acc, field) => {
            acc[field] = JSON.parse(cachedData[field]);
            return acc;
        }, {});
    }
    // Method to clear both Map and Redis cache for settings and extensions
    async clearCache() {
        try {
            // Clear the in-memory Maps
            this.settings.clear();
            this.extensions.clear();
            // Clear the Redis cache
            await redis.del(this.settingsKey, this.extensionsKey);
            // Reload settings and extensions from the database and update the caches
            await this.loadSettingsFromDB();
            await this.loadExtensionsFromDB();
            console.log("Settings & Extensions Cache cleared and reloaded successfully");
        }
        catch (error) {
            (0, logger_1.default)("error", "CacheManager", __filename, `Cache clear and reload failed: ${error.message}`);
            throw error;
        }
    }
}
exports.CacheManager = CacheManager;
