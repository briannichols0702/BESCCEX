"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProviderHealthy = exports.getWssProvider = exports.getProvider = exports.initializeProvider = void 0;
const ethers_1 = require("ethers");
const chains_1 = require("./chains");
const logger_1 = require("../logger");
// Initialize Ethereum provider
const initializeProvider = (chain) => {
    const provider = (0, exports.getProvider)(chain);
    if (!provider) {
        throw new Error(`Failed to initialize provider for chain ${chain}`);
    }
    return provider;
};
exports.initializeProvider = initializeProvider;
const getEnv = (key, defaultValue = "") => process.env[key] || defaultValue;
const getProvider = async (chainSymbol) => {
    try {
        const chainConfig = chains_1.chainConfigs[chainSymbol];
        if (!chainConfig)
            throw new Error(`Unsupported chain: ${chainSymbol}`);
        const networkName = getEnv(`${chainSymbol}_NETWORK`);
        if (!networkName)
            throw new Error(`Environment variable ${chainSymbol}_NETWORK is not set`);
        const rpcName = getEnv(`${chainSymbol}_${networkName.toUpperCase()}_RPC`);
        if (!rpcName)
            throw new Error(`Environment variable ${rpcName} is not set`);
        return new ethers_1.JsonRpcProvider(rpcName);
    }
    catch (error) {
        (0, logger_1.logError)("get_provider", error, __filename);
        throw error;
    }
};
exports.getProvider = getProvider;
const getWssProvider = (chainSymbol) => {
    try {
        const chainConfig = chains_1.chainConfigs[chainSymbol];
        if (!chainConfig) {
            throw new Error(`Unsupported chain: ${chainSymbol}`);
        }
        const networkName = getEnv(`${chainSymbol}_NETWORK`);
        if (!networkName) {
            throw new Error(`Environment variable ${chainSymbol}_NETWORK is not set`);
        }
        const rpcWssVar = `${chainSymbol}_${networkName.toUpperCase()}_RPC_WSS`;
        const rpcWssUrl = getEnv(rpcWssVar);
        if (!rpcWssUrl) {
            throw new Error(`Environment variable ${rpcWssVar} is not set`);
        }
        return new ethers_1.WebSocketProvider(rpcWssUrl);
    }
    catch (error) {
        (0, logger_1.logError)("get_wss_provider", error, __filename);
        console.error(error.message);
        throw error;
    }
};
exports.getWssProvider = getWssProvider;
async function isProviderHealthy(provider) {
    try {
        const blockNumber = await provider.getBlockNumber();
        return blockNumber > 0;
    }
    catch (_a) {
        return false;
    }
}
exports.isProviderHealthy = isProviderHealthy;
