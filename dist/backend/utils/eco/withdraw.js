"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrivateLedger = exports.handleEvmWithdrawal = void 0;
const db_1 = require("@b/db");
const chains_1 = require("./chains");
const utils_1 = require("@b/utils");
const wallet_1 = require("@b/utils/eco/wallet");
const provider_1 = require("./provider");
const ethers_1 = require("ethers");
const handleEvmWithdrawal = async (id, walletId, chain, amount, toAddress) => {
    (0, wallet_1.validateAddress)(toAddress, chain);
    const provider = await (0, provider_1.initializeProvider)(chain);
    const userWallet = await db_1.models.wallet.findByPk(walletId);
    if (!userWallet) {
        throw new Error("User wallet not found");
    }
    const { currency } = userWallet;
    const { contract, contractAddress, gasPayer, contractType, tokenDecimals } = await (0, wallet_1.initializeContracts)(chain, currency, provider);
    const amountEth = ethers_1.ethers.parseUnits(amount.toString(), tokenDecimals);
    let walletData, actualTokenOwner, alternativeWalletUsed, transaction, alternativeWallet;
    if (contractType === "PERMIT") {
        walletData = await (0, wallet_1.getWalletData)(walletId, chain);
        const ownerData = await (0, wallet_1.getAndValidateTokenOwner)(walletData, amountEth, contract, provider);
        actualTokenOwner = ownerData.actualTokenOwner;
        alternativeWalletUsed = ownerData.alternativeWalletUsed;
        alternativeWallet = ownerData.alternativeWallet;
        try {
            await (0, wallet_1.executePermit)(contract, contractAddress, gasPayer, actualTokenOwner, amountEth, provider);
        }
        catch (error) {
            console.error(`Failed to execute permit: ${error.message}`);
            throw new Error(`Failed to execute permit: ${error.message}`);
        }
        try {
            transaction = await (0, wallet_1.executeEcosystemWithdrawal)(contract, contractAddress, gasPayer, actualTokenOwner, toAddress, amountEth, provider);
        }
        catch (error) {
            console.error(`Failed to execute withdrawal: ${error.message}`);
            throw new Error(`Failed to execute withdrawal: ${error.message}`);
        }
    }
    else if (contractType === "NO_PERMIT") {
        const isNative = chains_1.chainConfigs[chain].currency === currency;
        try {
            transaction = await (0, wallet_1.executeNoPermitWithdrawal)(chain, contractAddress, gasPayer, toAddress, amountEth, provider, isNative);
        }
        catch (error) {
            console.error(`Failed to execute withdrawal: ${error.message}`);
            throw new Error(`Failed to execute withdrawal: ${error.message}`);
        }
    }
    else if (contractType === "NATIVE") {
        try {
            walletData = await (0, wallet_1.getWalletData)(walletId, chain);
            const payer = await (0, wallet_1.getAndValidateNativeTokenOwner)(walletData, amountEth, provider);
            transaction = await (0, wallet_1.executeNativeWithdrawal)(payer, toAddress, amountEth, provider);
        }
        catch (error) {
            console.error(`Failed to execute withdrawal: ${error.message}`);
            throw new Error(`Failed to execute withdrawal: ${error.message}`);
        }
    }
    if (transaction && transaction.hash) {
        // Checking the transaction status
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            try {
                const txReceipt = await provider.getTransactionReceipt(transaction.hash);
                if (txReceipt && txReceipt.status === 1) {
                    if (contractType === "PERMIT") {
                        if (alternativeWalletUsed) {
                            await (0, wallet_1.updateAlternativeWallet)(currency, chain, amount);
                            // Deduct from the wallet that was used for withdrawal
                            await updatePrivateLedger(alternativeWallet.walletId, alternativeWallet.index, currency, chain, amount);
                        }
                        // Add to the wallet that initiated the withdrawal
                        await updatePrivateLedger(walletId, walletData.index, currency, chain, -amount);
                    }
                    await db_1.models.transaction.update({
                        status: "COMPLETED",
                        description: `Withdrawal of ${amount} ${currency} to ${toAddress}`,
                        referenceId: transaction.hash,
                    }, {
                        where: { id },
                    });
                    return true;
                }
                else {
                    attempts += 1;
                    await (0, utils_1.delay)(5000);
                }
            }
            catch (error) {
                console.error(`Failed to check transaction status: ${error.message}`);
                // TODO: Inform admin about this
                attempts += 1;
                await (0, utils_1.delay)(5000);
            }
        }
        // If loop exits, mark transaction as failed
        console.error(`Transaction ${transaction.hash} failed after ${maxAttempts} attempts.`);
    }
    throw new Error("Transaction failed");
};
exports.handleEvmWithdrawal = handleEvmWithdrawal;
async function updatePrivateLedger(walletId, index, currency, chain, amount) {
    var _a;
    // Fetch or create the ledger entry
    const ledger = await getPrivateLedger(walletId, index, currency, chain);
    // Update the offchainDifference
    const newOffchainDifference = ((_a = ledger === null || ledger === void 0 ? void 0 : ledger.offchainDifference) !== null && _a !== void 0 ? _a : 0) + amount;
    const networkEnvVar = `${chain}_NETWORK`;
    const network = process.env[networkEnvVar];
    const existingLedger = await db_1.models.ecosystemPrivateLedger.findOne({
        where: {
            walletId,
            index,
            currency,
            chain,
            network,
        },
    });
    if (existingLedger) {
        await db_1.models.ecosystemPrivateLedger.update({
            offchainDifference: newOffchainDifference,
        }, {
            where: {
                walletId,
                index,
                currency,
                chain,
                network,
            },
        });
    }
    else {
        await db_1.models.ecosystemPrivateLedger.create({
            walletId,
            index,
            currency,
            chain,
            offchainDifference: newOffchainDifference,
            network,
        });
    }
}
exports.updatePrivateLedger = updatePrivateLedger;
async function getPrivateLedger(walletId, index, currency, chain) {
    // If not found, create a new ledger entry
    const networkEnvVar = `${chain}_NETWORK`;
    const network = process.env[networkEnvVar];
    // Try to find the existing ledger entry
    return (await db_1.models.ecosystemPrivateLedger.findOne({
        where: {
            walletId,
            index,
            currency,
            chain,
            network,
        },
    }));
}
async function normalizePrivateLedger(walletId) {
    // Fetch all ledger entries for this wallet
    const ledgers = await getAllPrivateLedgersForWallet(walletId);
    let positiveDifferences = [];
    let negativeDifferences = [];
    // Separate ledgers with positive and negative offchainDifference
    for (const ledger of ledgers) {
        if (ledger.offchainDifference > 0) {
            positiveDifferences.push(ledger);
        }
        else if (ledger.offchainDifference < 0) {
            negativeDifferences.push(ledger);
        }
    }
    // Sort the ledgers to optimize the normalization process
    positiveDifferences = positiveDifferences.sort((a, b) => b.offchainDifference - a.offchainDifference);
    negativeDifferences = negativeDifferences.sort((a, b) => a.offchainDifference - b.offchainDifference);
    // Normalize
    for (const posLedger of positiveDifferences) {
        for (const negLedger of negativeDifferences) {
            const amountToNormalize = Math.min(posLedger.offchainDifference, -negLedger.offchainDifference);
            if (amountToNormalize === 0) {
                continue;
            }
            // Update the ledgers
            await db_1.models.ecosystemPrivateLedger.update({
                offchainDifference: posLedger.offchainDifference - amountToNormalize,
            }, {
                where: { id: posLedger.id },
            });
            await db_1.models.ecosystemPrivateLedger.update({
                offchainDifference: negLedger.offchainDifference + amountToNormalize,
            }, {
                where: { id: negLedger.id },
            });
            // Update the in-memory objects to reflect the changes
            posLedger.offchainDifference -= amountToNormalize;
            negLedger.offchainDifference += amountToNormalize;
            // If one of the ledgers has been fully normalized, break out of the loop
            if (posLedger.offchainDifference === 0 ||
                negLedger.offchainDifference === 0) {
                break;
            }
        }
    }
}
async function getAllPrivateLedgersForWallet(walletId) {
    // Fetch all ledger entries for the given wallet ID
    return await db_1.models.ecosystemPrivateLedger.findAll({
        where: {
            walletId,
        },
    });
}
