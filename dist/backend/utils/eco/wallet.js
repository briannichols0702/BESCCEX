"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletBalance = exports.updateAlternativeWallet = exports.refundUser = exports.createPendingTransaction = exports.decrementWalletBalance = exports.updatePrivateLedger = exports.handleEcosystemDeposit = exports.getEcosystemPendingTransactions = exports.findAlternativeWalletData = exports.getWalletData = exports.getAndValidateNativeTokenOwner = exports.executeNativeWithdrawal = exports.executePermit = exports.getAndValidateTokenOwner = exports.executeNoPermitWithdrawal = exports.executeEcosystemWithdrawal = exports.initializeContracts = exports.getEcosystemTokenOwner = exports.validateEcosystemBalances = exports.validateAddress = exports.getGasPayer = exports.checkEcosystemAvailableFunds = exports.getMasterWalletByChainFull = exports.getMasterWalletByChain = exports.generateAndAddAddresses = exports.storeWallet = exports.getWalletByUserIdAndCurrency = exports.getActiveTokensByCurrency = exports.walletResponseAttributes = void 0;
const ethers_1 = require("ethers");
const tonweb_1 = __importDefault(require("tonweb"));
const blockchain_1 = require("./blockchain");
const gas_1 = require("./gas");
const tokens_1 = require("./tokens");
const encrypt_1 = require("../encrypt");
const db_1 = require("@b/db");
const smartContract_1 = require("./smartContract");
const chains_1 = require("./chains");
const sequelize_1 = require("sequelize");
const custodialWallet_1 = require("./custodialWallet");
const logger_1 = require("@b/utils/logger");
exports.walletResponseAttributes = [
    "id",
    "currency",
    "chain",
    "address",
    "status",
    "balance",
];
const utxo_1 = require("@b/utils/eco/utxo");
const error_1 = require("@b/utils/error");
const web3_js_1 = require("@solana/web3.js");
const sol_1 = __importDefault(require("@b/blockchains/sol"));
const tron_1 = __importDefault(require("@b/blockchains/tron"));
const xmr_1 = __importDefault(require("@b/blockchains/xmr"));
const ton_1 = __importDefault(require("@b/blockchains/ton"));
async function getActiveTokensByCurrency(currency) {
    const tokens = await db_1.models.ecosystemToken.findAll({
        where: { currency, status: true },
    });
    return tokens.filter((token) => token.network === process.env[`${token.chain.toUpperCase()}_NETWORK`]);
}
exports.getActiveTokensByCurrency = getActiveTokensByCurrency;
async function getWalletByUserIdAndCurrency(userId, currency) {
    let generated = false;
    // Step 1: Fetch the wallet for the specified user and currency.
    let wallet = await db_1.models.wallet.findOne({
        where: {
            userId,
            currency,
            type: "ECO",
        },
        attributes: ["id", "type", "currency", "balance", "address"],
    });
    // Step 2: If no wallet is found, generate a new wallet.
    if (!wallet) {
        wallet = await (0, exports.storeWallet)({ id: userId }, currency);
        generated = true;
    }
    // Step 3: If wallet is still not found after attempting creation, throw an error.
    if (!wallet) {
        throw (0, error_1.createError)(404, "Wallet not found");
    }
    // Step 4: Retrieve active tokens for the currency.
    const tokens = await getActiveTokensByCurrency(currency);
    // Step 5: Check if the wallet's address is empty or if it has incomplete addresses.
    let addresses = wallet.address
        ? typeof wallet.address === "string"
            ? JSON.parse(wallet.address)
            : wallet.address
        : {};
    if (typeof addresses === "string") {
        addresses = JSON.parse(addresses);
    }
    if (!addresses ||
        (addresses && Object.keys(addresses).length < tokens.length)) {
        const tokensWithoutAddress = tokens.filter((token) => !addresses || !addresses.hasOwnProperty(token.chain));
        // Generate and add missing addresses to the wallet.
        if (tokensWithoutAddress.length > 0) {
            await db_1.sequelize.transaction(async (transaction) => {
                await (0, exports.generateAndAddAddresses)(wallet, tokensWithoutAddress, transaction);
            });
        }
        // Fetch and return the updated wallet after generating missing addresses.
        const updatedWallet = await db_1.models.wallet.findOne({
            where: { id: wallet.id },
            attributes: ["id", "type", "currency", "balance", "address"],
        });
        if (!updatedWallet) {
            throw (0, error_1.createError)(500, "Failed to update wallet with new addresses");
        }
        return updatedWallet;
    }
    return wallet;
}
exports.getWalletByUserIdAndCurrency = getWalletByUserIdAndCurrency;
const storeWallet = async (user, currency) => {
    const tokens = await getActiveTokensByCurrency(currency);
    if (!tokens.length) {
        handleError("No enabled tokens found for this currency");
    }
    try {
        (0, encrypt_1.encrypt)("test");
    }
    catch (error) {
        handleError("Encryption key is not set");
    }
    return await db_1.sequelize.transaction(async (transaction) => {
        const existingWallet = await db_1.models.wallet.findOne({
            where: {
                userId: user.id,
                currency: currency,
                type: "ECO",
            },
            transaction,
        });
        // if exists and addresses is empty then return it
        let addresses = existingWallet && existingWallet.address
            ? typeof existingWallet.address === "string"
                ? JSON.parse(existingWallet.address)
                : existingWallet.address
            : {};
        if (typeof addresses === "string") {
            addresses = JSON.parse(addresses);
        }
        if (existingWallet && addresses && Object.keys(addresses).length === 0) {
            return existingWallet;
        }
        // Proceed with wallet creation if not exists
        const newWallet = await db_1.models.wallet.create({
            userId: user.id,
            type: "ECO",
            currency,
            balance: 0,
            inOrder: 0,
            status: true,
        }, { transaction });
        if (!newWallet) {
            throw new Error("Failed to create wallet");
        }
        return await (0, exports.generateAndAddAddresses)(newWallet, tokens, transaction);
    });
};
exports.storeWallet = storeWallet;
const generateAndAddAddresses = async (wallet, tokens, transaction) => {
    let addresses = wallet.address
        ? typeof wallet.address === "string"
            ? JSON.parse(wallet.address)
            : wallet.address
        : {};
    if (typeof addresses === "string") {
        addresses = JSON.parse(addresses);
    }
    for (const token of tokens) {
        try {
            switch (token.contractType) {
                case "PERMIT":
                    if (token.chain === "SOL") {
                        await handleSolanaWallet(wallet, addresses, transaction);
                    }
                    else {
                        await handlePermitContract(token, wallet, addresses, transaction);
                    }
                    break;
                case "NO_PERMIT":
                    await handleNoPermitContract(token, wallet, addresses);
                    break;
                case "NATIVE":
                    if (token.chain === "SOL") {
                        await handleSolanaNativeWallet(wallet, addresses, transaction);
                    }
                    else if (token.chain === "TRON") {
                        await handleTronNativeWallet(wallet, addresses, transaction);
                    }
                    else if (token.chain === "XMR") {
                        await handleMoneroNativeWallet(wallet, addresses, transaction);
                    }
                    else if (token.chain === "TON") {
                        await handleTonNativeWallet(wallet, addresses, transaction);
                    }
                    else {
                        await handleNativeContract(token, wallet, addresses, transaction);
                    }
                    break;
                default:
                    handleError(`Unknown contract type for token ${token.name}`, false);
            }
        }
        catch (error) {
            handleError(`Failed to generate address for token ${token.name}: ${error.message}`, false);
        }
    }
    if (Object.keys(addresses).length === 0) {
        handleError("Failed to generate any addresses for the wallet");
    }
    // Update the wallet with the new addresses
    await db_1.models.wallet.update({ address: JSON.stringify(addresses) }, {
        where: { id: wallet.id },
        transaction,
    });
    const updatedWallet = await db_1.models.wallet.findOne({
        where: { id: wallet.id },
        transaction,
    });
    if (!updatedWallet) {
        handleError("Failed to update wallet with new addresses");
    }
    return updatedWallet;
};
exports.generateAndAddAddresses = generateAndAddAddresses;
const handleNativeContract = async (token, newWallet, addresses, transaction) => {
    let encryptedWalletData;
    if (["BTC", "LTC", "DOGE", "DASH"].includes(token.chain)) {
        const wallet = (0, utxo_1.createUTXOWallet)(token.chain);
        addresses[token.chain] = {
            address: wallet.address,
            network: token.network,
            balance: 0,
        };
        encryptedWalletData = (0, encrypt_1.encrypt)(JSON.stringify(wallet.data));
    }
    else {
        const wallet = ethers_1.ethers.Wallet.createRandom();
        if (!wallet.mnemonic)
            throw new Error("Mnemonic not found");
        const hdNode = ethers_1.ethers.HDNodeWallet.fromPhrase(wallet.mnemonic.phrase);
        addresses[token.chain] = {
            address: hdNode.address,
            network: token.network,
            balance: 0,
        };
        if (!hdNode.mnemonic)
            throw new Error("Mnemonic not found");
        encryptedWalletData = (0, encrypt_1.encrypt)(JSON.stringify({
            mnemonic: hdNode.mnemonic.phrase,
            publicKey: hdNode.publicKey,
            privateKey: hdNode.privateKey,
            xprv: hdNode.extendedKey,
            xpub: hdNode.neuter().extendedKey,
            chainCode: hdNode.chainCode,
            path: hdNode.path,
        }));
    }
    const walletData = await db_1.models.walletData.findOne({
        where: {
            walletId: newWallet.id,
            currency: token.currency,
            chain: token.chain,
        },
        transaction,
    });
    if (walletData) {
        // Update the existing record
        await walletData.update({
            balance: 0, // Update this as per your logic
            index: 0,
            data: encryptedWalletData,
        }, transaction);
    }
    else {
        // Create a new record
        await db_1.models.walletData.create({
            walletId: newWallet.id,
            currency: token.currency,
            chain: token.chain,
            balance: 0,
            index: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
};
const handleSolanaNativeWallet = async (wallet, addresses, transaction) => {
    const solanaService = await sol_1.default.getInstance();
    const { address, data } = solanaService.createWallet();
    addresses["SOL"] = {
        address,
        network: process.env.SOLANA_NETWORK || "mainnet",
        balance: 0,
    };
    const encryptedWalletData = (0, encrypt_1.encrypt)(JSON.stringify(data));
    const walletData = await db_1.models.walletData.findOne({
        where: {
            walletId: wallet.id,
            currency: "SOL",
            chain: "SOL",
        },
        transaction,
    });
    if (walletData) {
        // Update the existing record
        await walletData.update({
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
    else {
        // Create a new record
        await db_1.models.walletData.create({
            walletId: wallet.id,
            currency: "SOL",
            chain: "SOL",
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
};
const handleSolanaWallet = async (wallet, addresses, transaction) => {
    const solanaService = await sol_1.default.getInstance();
    const { address, data } = solanaService.createWallet();
    addresses["SOL"] = {
        address,
        network: process.env.SOLANA_NETWORK || "mainnet",
        balance: 0,
    };
    const encryptedWalletData = (0, encrypt_1.encrypt)(JSON.stringify(data));
    const walletData = await db_1.models.walletData.findOne({
        where: {
            walletId: wallet.id,
            currency: wallet.currency,
            chain: "SOL",
        },
        transaction,
    });
    if (walletData) {
        // Update the existing record
        await walletData.update({
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
    else {
        // Create a new record
        await db_1.models.walletData.create({
            walletId: wallet.id,
            currency: wallet.currency,
            chain: "SOL",
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
};
const handleTronNativeWallet = async (wallet, addresses, transaction) => {
    const tronService = await tron_1.default.getInstance();
    const { address, data } = tronService.createWallet();
    addresses["TRON"] = {
        address,
        network: process.env.TRON_NETWORK || "mainnet",
        balance: 0,
    };
    const encryptedWalletData = (0, encrypt_1.encrypt)(JSON.stringify(data));
    const walletData = await db_1.models.walletData.findOne({
        where: {
            walletId: wallet.id,
            currency: "TRX",
            chain: "TRON",
        },
        transaction,
    });
    if (walletData) {
        // Update the existing record
        await walletData.update({
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
    else {
        // Create a new record
        await db_1.models.walletData.create({
            walletId: wallet.id,
            currency: "TRX",
            chain: "TRON",
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
};
const handleMoneroNativeWallet = async (wallet, addresses, transaction) => {
    const moneroService = await xmr_1.default.getInstance();
    const { address, data } = await moneroService.createWallet(wallet.id);
    addresses["XMR"] = {
        address,
        network: process.env.MONERO_NETWORK || "mainnet",
        balance: 0,
    };
    const encryptedWalletData = (0, encrypt_1.encrypt)(JSON.stringify(data));
    const walletData = await db_1.models.walletData.findOne({
        where: {
            walletId: wallet.id,
            currency: "XMR",
            chain: "XMR",
        },
        transaction,
    });
    if (walletData) {
        // Update the existing record
        await walletData.update({
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
    else {
        // Create a new record
        await db_1.models.walletData.create({
            walletId: wallet.id,
            currency: "XMR",
            chain: "XMR",
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
};
const handleTonNativeWallet = async (wallet, addresses, transaction) => {
    const tonService = await ton_1.default.getInstance();
    const { address, data } = await tonService.createWallet();
    addresses["TON"] = {
        address,
        network: process.env.TON_NETWORK || "mainnet",
        balance: 0,
    };
    const encryptedWalletData = (0, encrypt_1.encrypt)(JSON.stringify(data));
    const walletData = await db_1.models.walletData.findOne({
        where: {
            walletId: wallet.id,
            currency: "TON",
            chain: "TON",
        },
        transaction,
    });
    if (walletData) {
        // Update the existing record
        await walletData.update({
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
    else {
        // Create a new record
        await db_1.models.walletData.create({
            walletId: wallet.id,
            currency: "TON",
            chain: "TON",
            balance: 0,
            data: encryptedWalletData,
        }, { transaction });
    }
};
const handleError = (message, throwIt = true) => {
    console.error(message);
    if (throwIt) {
        throw new Error(message);
    }
};
const handlePermitContract = async (token, newWallet, addresses, transaction) => {
    // Assuming the 'token' object has properties: chain, network, contractType
    const masterWallet = await db_1.models.ecosystemMasterWallet.findOne({
        where: { chain: token.chain, status: true },
        transaction,
    });
    if (!masterWallet || !masterWallet.data) {
        console.warn(`Skipping chain ${token.chain} - Master wallet not found or not enabled`);
        return;
    }
    const nextIndex = masterWallet.lastIndex != null ? masterWallet.lastIndex + 1 : 1;
    await db_1.models.ecosystemMasterWallet.update({ lastIndex: nextIndex }, {
        where: { id: masterWallet.id },
        transaction,
    });
    const decryptedMasterData = JSON.parse((0, encrypt_1.decrypt)(masterWallet.data));
    const hdNode = ethers_1.ethers.HDNodeWallet.fromPhrase(decryptedMasterData.mnemonic);
    const childNode = hdNode.deriveChild(nextIndex);
    if (!childNode.address) {
        throw new Error("Address failed to generate");
    }
    addresses[token.chain] = {
        address: childNode.address,
        network: token.network,
        balance: 0,
    };
    const encryptedChildData = (0, encrypt_1.encrypt)(JSON.stringify({
        address: childNode.address,
        publicKey: childNode.publicKey,
        privateKey: childNode.privateKey,
    }));
    const walletData = await db_1.models.walletData.findOne({
        where: {
            walletId: newWallet.id,
            currency: token.currency,
            chain: token.chain,
        },
        transaction,
    });
    if (walletData) {
        // Update the existing record
        await walletData.update({
            balance: 0, // Update this as per your logic
            index: nextIndex,
            data: encryptedChildData,
        }, { transaction });
    }
    else {
        // Create a new record
        await db_1.models.walletData.create({
            walletId: newWallet.id,
            currency: token.currency,
            chain: token.chain,
            balance: 0,
            index: nextIndex,
            data: encryptedChildData,
        }, { transaction });
    }
};
const handleNoPermitContract = async (token, newWallet, addresses) => {
    addresses[token.chain] = {
        balance: 0,
    };
};
async function getMasterWalletByChain(chain) {
    try {
        return await db_1.models.ecosystemMasterWallet.findOne({
            where: { chain },
            attributes: exports.walletResponseAttributes,
        });
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
}
exports.getMasterWalletByChain = getMasterWalletByChain;
async function getMasterWalletByChainFull(chain) {
    try {
        const wallet = await db_1.models.ecosystemMasterWallet.findOne({
            where: { chain },
        });
        if (!wallet) {
            throw new Error(`Master wallet not found for chain: ${chain}`);
        }
        return wallet;
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
}
exports.getMasterWalletByChainFull = getMasterWalletByChainFull;
async function checkEcosystemAvailableFunds(userWallet, walletData, totalAmount) {
    try {
        const totalAvailable = await getTotalAvailable(userWallet, walletData);
        if (totalAvailable < totalAmount)
            throw new Error("Insufficient funds for withdrawal including fee");
        return totalAvailable;
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw new Error("Withdrawal failed - please try again later");
    }
}
exports.checkEcosystemAvailableFunds = checkEcosystemAvailableFunds;
const getTotalAvailable = async (userWallet, walletData) => {
    const pvEntry = await db_1.models.ecosystemPrivateLedger.findOne({
        where: {
            walletId: userWallet.id,
            index: walletData.index,
            currency: userWallet.currency,
            chain: walletData.chain,
        },
    });
    return userWallet.balance + (pvEntry ? pvEntry.offchainDifference : 0);
};
async function getGasPayer(chain, provider) {
    try {
        const masterWallet = await getMasterWalletByChainFull(chain);
        if (!masterWallet) {
            throw new Error("Master wallet not found");
        }
        const { data } = masterWallet;
        if (!data) {
            throw new Error("Master wallet data not found");
        }
        const decryptedMasterData = JSON.parse((0, encrypt_1.decrypt)(data));
        return new ethers_1.ethers.Wallet(decryptedMasterData.privateKey, provider);
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw new Error("Withdrawal failed - please try again later");
    }
}
exports.getGasPayer = getGasPayer;
const validateAddress = (toAddress, chain) => {
    if (chain === "SOL") {
        // Solana address validation
        try {
            new web3_js_1.PublicKey(toAddress);
        }
        catch (error) {
            throw new Error(`Invalid Solana address: ${toAddress}`);
        }
    }
    else if (chain === "TRON") {
        // Tron address validation (should start with 'T')
        if (!toAddress.startsWith("T")) {
            throw new Error(`Invalid Tron address: ${toAddress}`);
        }
    }
    else if (chain === "XMR") {
        // Monero address validation (starts with '4' or '8')
        if (!toAddress.startsWith("4") && !toAddress.startsWith("8")) {
            throw new Error(`Invalid Monero address: ${toAddress}`);
        }
    }
    else if (chain === "TON") {
        try {
            // Accept both raw and user-friendly TON addresses
            const tonAddress = new tonweb_1.default.utils.Address(toAddress);
            if (!tonAddress || !tonAddress.toString()) {
                throw new Error(`Invalid TON address: ${toAddress}`);
            }
        }
        catch (error) {
            throw new Error(`Invalid TON address: ${toAddress}`);
        }
    }
    else {
        // Ethereum address validation (via ethers.js)
        if (!ethers_1.ethers.isAddress(toAddress)) {
            throw new Error(`Invalid target wallet address: ${toAddress}`);
        }
    }
};
exports.validateAddress = validateAddress;
const validateEcosystemBalances = async (tokenContract, actualTokenOwner, amount) => {
    try {
        const tokenOwnerBalance = (await tokenContract.balanceOf(actualTokenOwner.address)).toString();
        if (tokenOwnerBalance < amount) {
            throw new Error("Insufficient funds in the wallet for withdrawal");
        }
        return true;
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
};
exports.validateEcosystemBalances = validateEcosystemBalances;
const getEcosystemTokenOwner = (walletData, provider) => {
    const { data } = walletData;
    const decryptedData = JSON.parse((0, encrypt_1.decrypt)(data));
    const { privateKey } = decryptedData;
    return new ethers_1.ethers.Wallet(privateKey, provider);
};
exports.getEcosystemTokenOwner = getEcosystemTokenOwner;
const initializeContracts = async (chain, currency, provider) => {
    try {
        const { contractAddress, contractType, tokenDecimals } = await (0, tokens_1.getTokenContractAddress)(chain, currency);
        const gasPayer = await getGasPayer(chain, provider);
        const { abi } = await (0, smartContract_1.getSmartContract)("token", "ERC20");
        const contract = new ethers_1.ethers.Contract(contractAddress, abi, provider);
        return {
            contract,
            contractAddress,
            gasPayer,
            contractType,
            tokenDecimals,
        };
    }
    catch (error) {
        (0, logger_1.logError)("contract", error, __filename);
        throw error;
    }
};
exports.initializeContracts = initializeContracts;
const executeEcosystemWithdrawal = async (tokenContract, tokenContractAddress, gasPayer, tokenOwner, toAddress, amount, provider) => {
    try {
        const gasPrice = await (0, gas_1.getAdjustedGasPrice)(provider);
        const transferFromTransaction = {
            to: tokenContractAddress,
            from: gasPayer.address,
            data: tokenContract.interface.encodeFunctionData("transferFrom", [
                tokenOwner.address,
                toAddress,
                amount,
            ]),
        };
        const gasLimitForTransferFrom = await (0, gas_1.estimateGas)(transferFromTransaction, provider);
        const trx = await tokenContract
            .connect(gasPayer)
            .getFunction("transferFrom")
            .send(tokenOwner.address, toAddress, amount, {
            gasPrice: gasPrice,
            gasLimit: gasLimitForTransferFrom,
        });
        await trx.wait(2);
        return trx;
    }
    catch (error) {
        (0, logger_1.logError)("contract", error, __filename);
        throw error;
    }
};
exports.executeEcosystemWithdrawal = executeEcosystemWithdrawal;
const executeNoPermitWithdrawal = async (chain, tokenContractAddress, gasPayer, toAddress, amount, provider, isNative) => {
    try {
        const custodialWallets = await (0, custodialWallet_1.getActiveCustodialWallets)(chain);
        if (!custodialWallets || custodialWallets.length === 0) {
            throw new Error("No custodial wallets found");
        }
        let tokenOwner, custodialContract, custodialContractAddress;
        for (const custodialWallet of custodialWallets) {
            const custodialWalletContract = await (0, custodialWallet_1.getCustodialWalletContract)(custodialWallet.address, provider);
            const balance = await (0, custodialWallet_1.getCustodialWalletTokenBalance)(custodialWalletContract, tokenContractAddress);
            if (BigInt(balance) >= amount) {
                tokenOwner = custodialWallet;
                custodialContract = custodialWalletContract;
                custodialContractAddress = custodialWallet.address;
                break;
            }
        }
        if (!tokenOwner) {
            throw new Error("No custodial wallets found");
        }
        let trx;
        if (isNative) {
            trx = await custodialContract
                .connect(gasPayer)
                .getFunction("transferNative")
                .send(toAddress, amount);
        }
        else {
            trx = await custodialContract
                .connect(gasPayer)
                .getFunction("transferTokens")
                .send(tokenContractAddress, toAddress, amount);
        }
        await trx.wait(2);
        return trx;
    }
    catch (error) {
        (0, logger_1.logError)("contract", error, __filename);
        throw error;
    }
};
exports.executeNoPermitWithdrawal = executeNoPermitWithdrawal;
async function getAndValidateTokenOwner(walletData, amountEth, tokenContract, provider) {
    try {
        let alternativeWalletUsed = false;
        const tokenOwner = await (0, exports.getEcosystemTokenOwner)(walletData, provider);
        let actualTokenOwner = tokenOwner;
        let alternativeWallet = null;
        const onChainBalance = await tokenContract.balanceOf(tokenOwner.address);
        if (onChainBalance < amountEth) {
            const alternativeWalletData = await findAlternativeWalletData(walletData, (0, blockchain_1.fromBigInt)(amountEth));
            alternativeWallet = alternativeWalletData;
            actualTokenOwner = (0, exports.getEcosystemTokenOwner)(alternativeWalletData, provider);
            alternativeWalletUsed = true;
        }
        (0, exports.validateEcosystemBalances)(tokenContract, actualTokenOwner, amountEth);
        return { actualTokenOwner, alternativeWalletUsed, alternativeWallet };
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
}
exports.getAndValidateTokenOwner = getAndValidateTokenOwner;
const executePermit = async (tokenContract, tokenContractAddress, gasPayer, tokenOwner, amount, provider) => {
    try {
        const nonce = await tokenContract.nonces(tokenOwner.address);
        const deadline = (0, chains_1.getTimestampInSeconds)() + 4200;
        const domain = {
            chainId: await (0, chains_1.getChainId)(provider),
            name: await tokenContract.name(),
            verifyingContract: tokenContractAddress,
            version: "1",
        };
        const types = {
            Permit: [
                {
                    name: "owner",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ],
        };
        const values = {
            owner: tokenOwner.address,
            spender: gasPayer.address,
            value: amount,
            nonce: nonce,
            deadline: deadline,
        };
        const signature = await tokenOwner.signTypedData(domain, types, values);
        const sig = ethers_1.ethers.Signature.from(signature);
        const recovered = ethers_1.ethers.verifyTypedData(domain, types, values, sig);
        if (recovered !== tokenOwner.address) {
            throw new Error("Invalid signature");
        }
        const gasPrice = await (0, gas_1.getAdjustedGasPrice)(provider);
        const permitTransaction = {
            to: tokenContractAddress,
            from: tokenOwner.address,
            nonce: nonce,
            data: tokenContract.interface.encodeFunctionData("permit", [
                tokenOwner.address,
                gasPayer.address,
                amount,
                deadline,
                sig.v,
                sig.r,
                sig.s,
            ]),
        };
        const gasLimitForPermit = await (0, gas_1.estimateGas)(permitTransaction, provider);
        const gasPayerBalance = (await tokenContract.balanceOf(gasPayer.address)).toString();
        if (BigInt(gasPayerBalance) <
            BigInt(gasLimitForPermit) * gasPrice * BigInt(2)) {
            throw new Error("Withdrawal failed, Please contact support team.");
        }
        const tx = await tokenContract
            .connect(gasPayer)
            .getFunction("permit")
            .send(tokenOwner.address, gasPayer.address, amount, deadline, sig.v, sig.r, sig.s, {
            gasPrice: gasPrice,
            gasLimit: gasLimitForPermit,
        });
        await tx.wait(2);
        return tx;
    }
    catch (error) {
        (0, logger_1.logError)("contract", error, __filename);
        throw error;
    }
};
exports.executePermit = executePermit;
const executeNativeWithdrawal = async (payer, toAddress, amount, provider) => {
    try {
        const balance = await provider.getBalance(payer.address);
        if (balance < amount) {
            throw new Error("Insufficient funds for withdrawal");
        }
        const tx = {
            to: toAddress,
            value: amount,
        };
        const response = await payer.sendTransaction(tx);
        await response.wait(2);
        return response;
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
};
exports.executeNativeWithdrawal = executeNativeWithdrawal;
async function getAndValidateNativeTokenOwner(walletData, amountEth, provider) {
    try {
        const tokenOwner = await (0, exports.getEcosystemTokenOwner)(walletData, provider);
        const onChainBalance = await provider.getBalance(tokenOwner.address);
        if (onChainBalance < amountEth) {
            throw new Error("Insufficient funds in the wallet for withdrawal");
        }
        return tokenOwner;
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
}
exports.getAndValidateNativeTokenOwner = getAndValidateNativeTokenOwner;
async function getWalletData(walletId, chain) {
    try {
        return await db_1.models.walletData.findOne({
            where: {
                walletId: walletId,
                chain: chain,
            },
        });
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
}
exports.getWalletData = getWalletData;
async function findAlternativeWalletData(walletData, amount) {
    try {
        const alternativeWalletData = await db_1.models.walletData.findOne({
            where: {
                currency: walletData.currency,
                chain: walletData.chain,
                balance: {
                    [sequelize_1.Op.gte]: amount,
                },
            },
        });
        if (!alternativeWalletData) {
            throw new Error("No alternative wallet with sufficient balance found");
        }
        return alternativeWalletData;
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
}
exports.findAlternativeWalletData = findAlternativeWalletData;
async function getEcosystemPendingTransactions() {
    try {
        return await db_1.models.transaction.findAll({
            where: {
                type: "WITHDRAW",
                status: "PENDING",
            },
            include: [{ model: db_1.models.wallet, where: { type: "ECO" } }],
        });
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
}
exports.getEcosystemPendingTransactions = getEcosystemPendingTransactions;
const handleEcosystemDeposit = async (trx) => {
    try {
        const transaction = await db_1.models.transaction.findOne({
            where: {
                referenceId: trx.hash,
            },
        });
        if (transaction) {
            throw new Error("Transaction already processed");
        }
        const wallet = await db_1.models.wallet.findOne({
            where: { id: trx.id },
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        const addresses = JSON.parse(wallet.address);
        const chainAddress = addresses[trx.chain];
        if (!chainAddress) {
            throw new Error("Address not found for the given chain");
        }
        chainAddress.balance = (chainAddress.balance || 0) + parseFloat(trx.amount);
        const walletBalance = wallet.balance + parseFloat(trx.amount);
        // **Calculate the fee appropriately**
        let fee = 0;
        const utxoChains = ["BTC", "DOGE", "LTC", "DASH"];
        if (utxoChains.includes(trx.chain)) {
            // For UTXO-based chains
            const totalInputValue = trx.inputs.reduce((sum, input) => {
                return sum + satoshiToBTC(parseFloat(input.value));
            }, 0);
            const totalOutputValue = trx.outputs.reduce((sum, output) => {
                return sum + satoshiToBTC(parseFloat(output.value));
            }, 0);
            // Calculate the fee
            fee = totalInputValue - totalOutputValue;
        }
        else {
            // For EVM-based chains
            if (!isNaN(parseFloat(trx.gasUsed)) && !isNaN(parseFloat(trx.gasPrice))) {
                fee = parseFloat(trx.gasUsed) * parseFloat(trx.gasPrice);
            }
            else {
                fee = 0;
            }
        }
        await db_1.models.wallet.update({
            balance: walletBalance,
            address: JSON.stringify(addresses),
        }, {
            where: { id: wallet.id },
        });
        const createdTransaction = await db_1.models.transaction.create({
            userId: wallet.userId,
            walletId: wallet.id,
            type: "DEPOSIT",
            status: trx.status === "CONFIRMED" ? "COMPLETED" : trx.status,
            amount: parseFloat(trx.amount),
            description: `Deposit of ${trx.amount} ${wallet.currency} from ${trx.from}`,
            referenceId: trx.hash,
            fee: fee,
            metadata: JSON.stringify({
                chain: trx.chain,
                currency: wallet.currency,
                gasLimit: trx.gasLimit,
                gasPrice: trx.gasPrice,
                gasUsed: trx.gasUsed,
            }),
        });
        const updatedWallet = await db_1.models.wallet.findOne({
            where: { id: wallet.id },
        });
        await db_1.models.walletData.update({
            balance: db_1.sequelize.literal(`balance + ${trx.amount}`),
        }, {
            where: {
                walletId: wallet.id,
                chain: trx.chain,
            },
        });
        return {
            transaction: createdTransaction,
            wallet: updatedWallet,
        };
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
};
exports.handleEcosystemDeposit = handleEcosystemDeposit;
const satoshiToBTC = (value) => value / 1e8;
async function updatePrivateLedger(wallet_id, index, currency, chain, difference) {
    try {
        const networkValue = process.env[`${chain}_NETWORK`];
        const uniqueIdentifier = {
            walletId: wallet_id,
            index: index,
            currency: currency,
            chain: chain,
            network: networkValue,
        };
        const existingLedger = await db_1.models.ecosystemPrivateLedger.findOne({
            where: uniqueIdentifier,
        });
        if (existingLedger) {
            await db_1.models.ecosystemPrivateLedger.update({
                offchainDifference: db_1.sequelize.literal(`offchain_difference + ${difference}`),
            }, {
                where: uniqueIdentifier,
            });
            return existingLedger;
        }
        else {
            return await db_1.models.ecosystemPrivateLedger.create({
                walletId: wallet_id,
                index: index,
                currency: currency,
                chain: chain,
                offchainDifference: difference,
                network: networkValue,
            });
        }
    }
    catch (error) {
        (0, logger_1.logError)("ledger", error, __filename);
        throw error;
    }
}
exports.updatePrivateLedger = updatePrivateLedger;
const updateBalancePrecision = (balance, chain) => {
    const fixedPrecisionChains = {
        BTC: 8,
        LTC: 8,
        DOGE: 8,
        DASH: 8,
        SOL: 8,
        TRON: 6,
    };
    if (fixedPrecisionChains[chain] !== undefined) {
        return parseFloat(balance.toFixed(fixedPrecisionChains[chain]));
    }
    return balance;
};
const decrementWalletBalance = async (userWallet, chain, amount) => {
    try {
        let newBalance = userWallet.balance - amount;
        newBalance = updateBalancePrecision(newBalance, chain);
        const addresses = JSON.parse(userWallet.address);
        if (addresses[chain]) {
            addresses[chain].balance = updateBalancePrecision(addresses[chain].balance - amount, chain);
        }
        else {
            throw new Error(`Chain ${chain} not found in the user's wallet addresses.`);
        }
        await db_1.models.wallet.update({
            balance: newBalance,
            address: JSON.stringify(addresses),
        }, {
            where: { id: userWallet.id },
        });
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
};
exports.decrementWalletBalance = decrementWalletBalance;
async function createPendingTransaction(userId, walletId, currency, chain, amount, toAddress, withdrawalFee, token) {
    try {
        return await db_1.models.transaction.create({
            userId: userId,
            walletId: walletId,
            type: "WITHDRAW",
            status: "PENDING",
            amount: amount,
            fee: withdrawalFee,
            description: `Pending withdrawal of ${amount} ${currency} to ${toAddress}`,
            metadata: JSON.stringify({
                toAddress: toAddress,
                chain: chain,
                contractType: token.contractType,
                contract: token.contract,
                decimals: token.decimals,
            }),
        });
    }
    catch (error) {
        (0, logger_1.logError)("transaction", error, __filename);
        throw error;
    }
}
exports.createPendingTransaction = createPendingTransaction;
const refundUser = async (transaction) => {
    try {
        await db_1.models.transaction.update({
            status: "FAILED",
            description: `Refund of ${transaction.amount}`,
        }, {
            where: { id: transaction.id },
        });
        const wallet = await db_1.models.wallet.findOne({
            where: { id: transaction.walletId },
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        const metadata = JSON.parse(transaction.metadata);
        const addresses = JSON.parse(wallet.address);
        const amount = transaction.amount + transaction.fee;
        if ((metadata === null || metadata === void 0 ? void 0 : metadata.chain) && addresses[metadata === null || metadata === void 0 ? void 0 : metadata.chain]) {
            addresses[metadata === null || metadata === void 0 ? void 0 : metadata.chain].balance += amount;
        }
        const walletBalance = wallet.balance + amount;
        await db_1.models.wallet.update({
            balance: walletBalance,
            address: JSON.stringify(addresses),
        }, {
            where: { id: wallet.id },
        });
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
};
exports.refundUser = refundUser;
const updateAlternativeWallet = async (currency, chain, amount) => {
    try {
        const alternativeWalletData = await db_1.models.walletData.findOne({
            where: {
                currency: currency,
                chain: chain,
            },
        });
        if (!alternativeWalletData) {
            throw new Error("Alternative wallet not found");
        }
        await db_1.models.walletData.update({
            balance: db_1.sequelize.literal(`balance - ${amount}`),
        }, {
            where: { id: alternativeWalletData.id },
        });
        await updatePrivateLedger(alternativeWalletData.walletId, alternativeWalletData.index, currency, chain, -amount);
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
};
exports.updateAlternativeWallet = updateAlternativeWallet;
async function updateWalletBalance(wallet, balanceChange, type) {
    try {
        if (!wallet)
            throw new Error("Wallet not found");
        let newBalance;
        const roundTo4DecimalPlaces = (num) => Math.round((num + Number.EPSILON) * 1e8) / 1e8;
        switch (type) {
            case "add":
                newBalance = roundTo4DecimalPlaces(wallet.balance + balanceChange);
                break;
            case "subtract":
                newBalance = roundTo4DecimalPlaces(wallet.balance - balanceChange);
                if (newBalance < 0) {
                    throw new Error("Insufficient funds");
                }
                break;
            default:
                throw new Error("Invalid type specified for updating wallet balance.");
        }
        await db_1.models.wallet.update({
            balance: newBalance,
        }, {
            where: { id: wallet.id },
        });
    }
    catch (error) {
        (0, logger_1.logError)("wallet", error, __filename);
        throw error;
    }
}
exports.updateWalletBalance = updateWalletBalance;
