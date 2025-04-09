"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSingleton = void 0;
const ioredis_1 = require("ioredis");
class RedisSingleton {
    constructor() { }
    static getInstance() {
        if (!RedisSingleton.instance) {
            RedisSingleton.instance = new ioredis_1.Redis();
        }
        return RedisSingleton.instance;
    }
}
exports.RedisSingleton = RedisSingleton;
