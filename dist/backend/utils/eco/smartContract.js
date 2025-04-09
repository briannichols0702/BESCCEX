"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractAbi = exports.getSmartContract = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chains_1 = require("./chains");
const logger_1 = require("@b/utils/logger");
async function getSmartContract(contractPath, name) {
    const filePath = path_1.default.resolve(process.cwd(), `ecosystem/smart-contracts/${contractPath}/${name}.json`);
    try {
        const fileContent = fs_1.default.readFileSync(filePath, "utf8");
        const contractJson = JSON.parse(fileContent);
        const { abi, bytecode } = contractJson;
        if (!bytecode || !abi)
            throw new Error(`Failed to extract bytecode or ABI for ${name}`);
        return { abi, bytecode };
    }
    catch (error) {
        (0, logger_1.logError)("get_smart_contract", error, __filename);
        console.error(`Failed to read contract JSON for ${name}: ${error.message}`);
        throw error;
    }
}
exports.getSmartContract = getSmartContract;
const getContractAbi = async (chain, network, contractAddress) => {
    const chainConfig = chains_1.chainConfigs[chain];
    if (!chainConfig) {
        throw new Error(`Unsupported chain: ${chain}`);
    }
    const apiKey = process.env[`${chain}_EXPLORER_API_KEY`];
    if (!apiKey) {
        throw new Error(`API Key for ${chain} is not set`);
    }
    const networkConfig = chainConfig.networks[network];
    if (!networkConfig || !networkConfig.explorer) {
        throw new Error(`Unsupported network: ${network} for chain: ${chain}`);
    }
    const apiUrl = `https://${networkConfig.explorer}/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status !== "1") {
            throw new Error(`API Error: ${data.message}`);
        }
        return data.result;
    }
    catch (error) {
        (0, logger_1.logError)("get_contract_abi", error, __filename);
        throw new Error(`Failed to fetch contract ABI: ${error.message}`);
    }
};
exports.getContractAbi = getContractAbi;
