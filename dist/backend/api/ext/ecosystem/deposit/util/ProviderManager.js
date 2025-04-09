"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocketProvider = exports.initializeHttpProvider = exports.chainProviders = void 0;
// ProviderManager.ts
const provider_1 = require("@b/utils/eco/provider");
const ethers_1 = require("ethers");
exports.chainProviders = new Map();
async function initializeHttpProvider(chain) {
    if (exports.chainProviders.has(chain)) {
        return exports.chainProviders.get(chain);
    }
    try {
        const httpProvider = await (0, provider_1.getProvider)(chain);
        if (await (0, provider_1.isProviderHealthy)(httpProvider)) {
            console.log(`Initialized HTTP provider for chain ${chain}`);
            exports.chainProviders.set(chain, httpProvider);
            return httpProvider;
        }
        throw new Error(`HTTP provider unhealthy for chain ${chain}`);
    }
    catch (error) {
        console.error(`Error initializing HTTP provider for chain ${chain}: ${error.message}`);
        return null;
    }
}
exports.initializeHttpProvider = initializeHttpProvider;
async function initializeWebSocketProvider(chain) {
    if (exports.chainProviders.has(chain)) {
        const existing = exports.chainProviders.get(chain);
        if (existing instanceof ethers_1.WebSocketProvider) {
            return existing;
        }
    }
    try {
        const wsProvider = (0, provider_1.getWssProvider)(chain);
        if (await (0, provider_1.isProviderHealthy)(wsProvider)) {
            console.log(`Initialized WebSocket provider for chain ${chain}`);
            exports.chainProviders.set(chain, wsProvider);
            return wsProvider;
        }
        throw new Error(`WebSocket provider unhealthy for chain ${chain}`);
    }
    catch (error) {
        console.error(`Error initializing WebSocket provider for chain ${chain}: ${error.message}`);
        return null;
    }
}
exports.initializeWebSocketProvider = initializeWebSocketProvider;
