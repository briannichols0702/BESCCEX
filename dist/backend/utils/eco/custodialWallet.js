"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveCustodialWallets = exports.deployCustodialContract = exports.getCustodialWalletContract = exports.getCustodialWalletNativeBalance = exports.getCustodialWalletTokenBalance = exports.getCustodialWalletBalances = void 0;
const ethers_1 = require("ethers");
const smartContract_1 = require("./smartContract");
const provider_1 = require("./provider");
const encrypt_1 = require("../encrypt");
const gas_1 = require("./gas");
const db_1 = require("@b/db");
const logger_1 = require("@b/utils/logger");
async function getCustodialWalletBalances(contract, tokens, format = true) {
    try {
        const tokensAddresses = tokens.map((token) => token.contract);
        const [nativeBalance, tokenBalances] = await contract.getAllBalances(tokensAddresses);
        const balances = tokenBalances.map((balance, index) => ({
            ...tokens[index],
            balance: format
                ? ethers_1.ethers.formatUnits(balance, tokens[index].decimals)
                : balance,
        }));
        const native = format ? ethers_1.ethers.formatEther(nativeBalance) : nativeBalance;
        return { balances, native };
    }
    catch (error) {
        (0, logger_1.logError)("custodial_wallet", error, __filename);
        throw new Error(`Failed to get custodial wallet balances: ${error.message}`);
    }
}
exports.getCustodialWalletBalances = getCustodialWalletBalances;
async function getCustodialWalletTokenBalance(contract, tokenContractAddress) {
    try {
        return await contract.getTokenBalance(tokenContractAddress);
    }
    catch (error) {
        (0, logger_1.logError)("custodial_wallet", error, __filename);
        throw new Error(`Failed to get token balance: ${error.message}`);
    }
}
exports.getCustodialWalletTokenBalance = getCustodialWalletTokenBalance;
async function getCustodialWalletNativeBalance(contract) {
    try {
        return await contract.getNativeBalance();
    }
    catch (error) {
        (0, logger_1.logError)("custodial_wallet", error, __filename);
        throw new Error(`Failed to get native balance: ${error.message}`);
    }
}
exports.getCustodialWalletNativeBalance = getCustodialWalletNativeBalance;
async function getCustodialWalletContract(address, provider) {
    try {
        const { abi } = await (0, smartContract_1.getSmartContract)("wallet", "CustodialWalletERC20");
        if (!abi) {
            throw new Error("Smart contract ABI or Bytecode not found");
        }
        return new ethers_1.ethers.Contract(address, abi, provider);
    }
    catch (error) {
        (0, logger_1.logError)("custodial_wallet", error, __filename);
        throw new Error(`Failed to get custodial wallet contract: ${error.message}`);
    }
}
exports.getCustodialWalletContract = getCustodialWalletContract;
async function deployCustodialContract(masterWallet) {
    try {
        const provider = await (0, provider_1.getProvider)(masterWallet.chain);
        if (!provider) {
            throw new Error("Provider not initialized");
        }
        let decryptedData;
        try {
            decryptedData = JSON.parse((0, encrypt_1.decrypt)(masterWallet.data));
        }
        catch (error) {
            throw new Error(`Failed to decrypt mnemonic: ${error.message}`);
        }
        if (!decryptedData || !decryptedData.privateKey) {
            throw new Error("Decrypted data or Mnemonic not found");
        }
        const { privateKey } = decryptedData;
        const signer = new ethers_1.ethers.Wallet(privateKey).connect(provider);
        const { abi, bytecode } = await (0, smartContract_1.getSmartContract)("wallet", "CustodialWalletERC20");
        if (!abi || !bytecode) {
            throw new Error("Smart contract ABI or Bytecode not found");
        }
        const custodialWalletFactory = new ethers_1.ContractFactory(abi, bytecode, signer);
        const gasPrice = await (0, gas_1.getAdjustedGasPrice)(provider);
        const custodialWalletContract = await custodialWalletFactory.deploy(masterWallet.address, {
            gasPrice: gasPrice,
        });
        const response = await custodialWalletContract.waitForDeployment();
        return await response.getAddress();
    }
    catch (error) {
        (0, logger_1.logError)("custodial_wallet_deployment", error, __filename);
        if ((0, ethers_1.isError)(error, "INSUFFICIENT_FUNDS")) {
            throw new Error("Not enough funds to deploy the contract");
        }
        throw new Error(error.message);
    }
}
exports.deployCustodialContract = deployCustodialContract;
async function getActiveCustodialWallets(chain) {
    try {
        const wallet = await db_1.models.ecosystemCustodialWallet.findAll({
            where: {
                chain: chain,
                status: true,
            },
        });
        if (!wallet) {
            throw new Error("No active custodial wallets found");
        }
        return wallet;
    }
    catch (error) {
        (0, logger_1.logError)("custodial_wallet", error, __filename);
        throw new Error(`Failed to get active custodial wallets: ${error.message}`);
    }
}
exports.getActiveCustodialWallets = getActiveCustodialWallets;
