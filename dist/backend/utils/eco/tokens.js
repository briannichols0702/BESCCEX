"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEcosystemToken = exports.deployTokenContract = exports.fetchTokenHolders = exports.getTokenContractAddress = void 0;
const ethers_1 = require("ethers");
const chains_1 = require("./chains");
const redis_1 = require("../redis");
const gas_1 = require("./gas");
const smartContract_1 = require("./smartContract");
const encrypt_1 = require("../encrypt");
const provider_1 = require("./provider");
const db_1 = require("@b/db");
const logger_1 = require("@b/utils/logger");
const CACHE_EXPIRATION = 300; // Cache for 5 minutes
async function getTokenContractAddress(chain, currency) {
    try {
        const token = await getEcosystemToken(chain, currency);
        if (!token) {
            throw new Error(`No token found for chain "${chain}" and currency "${currency}".`);
        }
        const contractAddress = token.contract;
        if (!ethers_1.ethers.isAddress(contractAddress)) {
            throw new Error(`The token contract address "${contractAddress}" is invalid.`);
        }
        return {
            contractAddress,
            contractType: token.contractType,
            tokenDecimals: token.decimals,
        };
    }
    catch (error) {
        (0, logger_1.logError)("get_token_contract_address", error, __filename);
        // Provide a user-friendly error message
        throw new Error(`Unable to retrieve token contract details for chain "${chain}" and currency "${currency}". ${error.message || "Please try again later."}`);
    }
}
exports.getTokenContractAddress = getTokenContractAddress;
const fetchTokenHolders = async (chain, network, contract) => {
    try {
        const chainConfig = chains_1.chainConfigs[chain];
        if (!chainConfig) {
            throw new Error(`Chain "${chain}" is not supported.`);
        }
        const apiKey = process.env[`${chain}_EXPLORER_API_KEY`];
        if (!apiKey) {
            throw new Error(`API key for chain "${chain}" is not configured.`);
        }
        const networkConfig = chainConfig.networks[network];
        if (!networkConfig || !networkConfig.explorer) {
            throw new Error(`Network "${network}" for chain "${chain}" is not supported.`);
        }
        const cacheKey = `token:${contract}:holders`;
        const cachedData = await getCachedData(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        const apiUrl = `https://${networkConfig.explorer}/api?module=account&action=tokentx&contractaddress=${contract}&page=1&offset=100&sort=asc&apikey=${apiKey}`;
        let data;
        try {
            const response = await fetch(apiUrl);
            data = await response.json();
        }
        catch (error) {
            (0, logger_1.logError)("fetch_token_holders", error, __filename);
            throw new Error("Failed to fetch token holders. Please check the API connection.");
        }
        if (data.status !== "1") {
            throw new Error(`Explorer API returned error: ${data.message}`);
        }
        const holders = {};
        for (const tx of data.result) {
            const { from, to, value } = tx;
            holders[from] = (holders[from] || 0) - parseFloat(value);
            holders[to] = (holders[to] || 0) + parseFloat(value);
        }
        const decimals = chainConfig.decimals || 18;
        const formattedHolders = Object.entries(holders)
            .map(([address, balance]) => ({
            address,
            balance: parseFloat((balance / Math.pow(10, decimals)).toFixed(8)),
        }))
            .filter((holder) => holder.balance > 0);
        const redis = redis_1.RedisSingleton.getInstance();
        await redis.setex(cacheKey, CACHE_EXPIRATION, JSON.stringify(formattedHolders));
        return formattedHolders;
    }
    catch (error) {
        (0, logger_1.logError)("fetch_token_holders", error, __filename);
        throw new Error(`Failed to fetch token holders for contract "${contract}" on chain "${chain}". ${error.message || "Please try again later."}`);
    }
};
exports.fetchTokenHolders = fetchTokenHolders;
const getCachedData = async (cacheKey) => {
    const redis = redis_1.RedisSingleton.getInstance();
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return null;
};
async function deployTokenContract(masterWallet, chain, name, symbol, receiver, decimals, initialBalance, cap) {
    var _a, _b;
    try {
        // Initialize Ethereum provider
        const provider = await (0, provider_1.getProvider)(chain);
        if (!provider) {
            throw new Error("Provider not initialized");
        }
        // Decrypt mnemonic
        if (!masterWallet.data) {
            throw new Error("Master wallet data not found");
        }
        const decryptedData = JSON.parse((0, encrypt_1.decrypt)(masterWallet.data));
        if (!decryptedData || !decryptedData.privateKey) {
            throw new Error("Decrypted data or Mnemonic not found");
        }
        const { privateKey } = decryptedData;
        // Create a signer
        const signer = new ethers_1.ethers.Wallet(privateKey).connect(provider);
        // Get contract ABI and Bytecode
        const smartContractFile = (_b = (_a = chains_1.chainConfigs[chain]) === null || _a === void 0 ? void 0 : _a.smartContract) === null || _b === void 0 ? void 0 : _b.file;
        if (!smartContractFile) {
            throw new Error(`Smart contract file not found for chain ${chain}`);
        }
        const { abi, bytecode } = await (0, smartContract_1.getSmartContract)("token", smartContractFile);
        if (!abi || !bytecode) {
            throw new Error("Smart contract ABI or Bytecode not found");
        }
        // Create Contract Factory
        const tokenFactory = new ethers_1.ContractFactory(abi, bytecode, signer);
        if (initialBalance === undefined || cap === undefined) {
            throw new Error("Initial balance or Cap is undefined");
        }
        // Convert initialBalance to its smallest unit based on the number of decimals
        const adjustedInitialBalance = ethers_1.ethers.parseUnits(initialBalance.toString(), decimals);
        const adjustedCap = ethers_1.ethers.parseUnits(cap.toString(), decimals);
        // Fetch adjusted gas price
        const gasPrice = await (0, gas_1.getAdjustedGasPrice)(provider);
        // Deploy the contract with dynamic gas settings
        const tokenContract = await tokenFactory.deploy(name, symbol, receiver, decimals, adjustedCap, adjustedInitialBalance, {
            gasPrice: gasPrice,
        });
        // Wait for the contract to be deployed
        const response = await tokenContract.waitForDeployment();
        return await response.getAddress();
    }
    catch (error) {
        // logError("deploy_token_contract", error, __filename);
        throw new Error(`Failed to deploy token contract on chain "${chain}". ${error.message || "An unknown error occurred."}`);
    }
}
exports.deployTokenContract = deployTokenContract;
async function getEcosystemToken(chain, currency) {
    const network = process.env[`${chain}_NETWORK`]; // Ensuring the network is dynamically fetched based on the chain
    const token = await db_1.models.ecosystemToken.findOne({
        where: {
            chain: chain,
            currency: currency,
            network: network,
            status: true,
        },
    });
    if (!token) {
        throw new Error(`Token not found for chain: ${chain} and currency: ${currency}`);
    }
    return token;
}
exports.getEcosystemToken = getEcosystemToken;
