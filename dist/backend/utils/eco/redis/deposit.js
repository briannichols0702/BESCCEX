"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromRedis = exports.loadFromRedis = exports.loadKeysFromRedis = exports.offloadToRedis = exports.storeAndBroadcastTransaction = void 0;
const redis_1 = require("@b/utils/redis");
const redis = redis_1.RedisSingleton.getInstance();
const setAsync = (key, value) => redis.set(key, value);
const getAsync = (key) => redis.get(key);
const delAsync = (key) => redis.del(key);
const keysAsync = (pattern) => redis.keys(pattern);
async function storeAndBroadcastTransaction(txDetails, txHash) {
    const pendingTransactions = (await loadFromRedis("pendingTransactions")) || {};
    pendingTransactions[txHash] = txDetails;
    await offloadToRedis("pendingTransactions", pendingTransactions);
}
exports.storeAndBroadcastTransaction = storeAndBroadcastTransaction;
async function offloadToRedis(key, value) {
    const serializedValue = JSON.stringify(value);
    await setAsync(key, serializedValue);
}
exports.offloadToRedis = offloadToRedis;
async function loadKeysFromRedis(pattern) {
    try {
        const keys = await keysAsync(pattern);
        return keys;
    }
    catch (error) {
        console.error("Failed to fetch keys:", error);
        return [];
    }
}
exports.loadKeysFromRedis = loadKeysFromRedis;
async function loadFromRedis(identifier) {
    const dataStr = await getAsync(identifier);
    if (!dataStr)
        return null;
    try {
        return JSON.parse(dataStr);
    }
    catch (error) {
        console.error("Failed to parse JSON:", error);
        return null;
    }
}
exports.loadFromRedis = loadFromRedis;
async function removeFromRedis(key) {
    try {
        const delResult = await delAsync(key);
        console.log(`Delete Result for key ${key}: `, delResult);
    }
    catch (error) {
        console.error(`Failed to delete key ${key}:`, error);
    }
}
exports.removeFromRedis = removeFromRedis;
