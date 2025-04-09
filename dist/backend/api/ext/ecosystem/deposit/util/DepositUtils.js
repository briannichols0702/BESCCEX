"use strict";
// DepositUtils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionDetails = exports.processTransaction = void 0;
const ethers_1 = require("ethers");
const deposit_1 = require("@b/utils/eco/redis/deposit");
const blockchain_1 = require("@b/utils/eco/blockchain");
/**
 * Decodes and validates a transaction, ensures `to` matches our target address.
 * Returns null if conditions fail.
 */
async function processTransaction(contractType, txHash, provider, address, chain, decimals, feeDecimals, walletId) {
    try {
        const tx = await provider.getTransaction(txHash);
        if (!tx || !tx.data)
            return false;
        const decodedData = (0, blockchain_1.decodeTransactionData)(tx.data);
        const realTo = decodedData.to || tx.to;
        const amount = decodedData.amount || tx.value;
        if (!realTo || !address) {
            console.error(`Invalid transaction data: realTo=${realTo}, address=${address}`);
            return false;
        }
        if (realTo.toLowerCase() !== address.toLowerCase())
            return false;
        const txDetails = await createTransactionDetails(contractType, walletId, tx, realTo, chain, decimals, feeDecimals, "DEPOSIT", amount);
        await (0, deposit_1.storeAndBroadcastTransaction)(txDetails, txHash);
        return true;
    }
    catch (error) {
        console.error(`Error processing transaction: ${error.message}, TxHash: ${txHash}`);
        return false;
    }
}
exports.processTransaction = processTransaction;
async function createTransactionDetails(contractType, walletId, tx, toAddress, chain, decimals, feeDecimals, type, amount = tx.amount) {
    const formattedAmount = ethers_1.ethers.formatUnits(amount.toString(), decimals);
    const formattedGasLimit = tx.gasLimit ? tx.gasLimit.toString() : "N/A";
    const formattedGasPrice = tx.gasPrice
        ? ethers_1.ethers.formatUnits(tx.gasPrice.toString(), feeDecimals)
        : "N/A";
    return {
        contractType,
        id: walletId,
        chain,
        hash: tx.hash,
        type,
        from: tx.from,
        to: toAddress,
        amount: formattedAmount,
        gasLimit: formattedGasLimit,
        gasPrice: formattedGasPrice,
    };
}
exports.createTransactionDetails = createTransactionDetails;
