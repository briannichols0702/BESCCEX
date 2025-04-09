"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPendingTransactions = void 0;
// PendingVerification.ts
const deposit_1 = require("@b/utils/eco/redis/deposit");
const wallet_1 = require("@b/utils/eco/wallet");
const Websocket_1 = require("@b/handler/Websocket");
const utxo_1 = require("@b/utils/eco/utxo");
const notifications_1 = require("@b/utils/notifications");
const utils_1 = require("../../wallet/utils");
const ProviderManager_1 = require("./ProviderManager");
async function verifyPendingTransactions() {
    if (!(0, Websocket_1.hasClients)(`/api/ext/ecosystem/deposit`)) {
        return;
    }
    const processingTransactions = new Set();
    try {
        const pendingTransactions = await (0, deposit_1.loadFromRedis)("pendingTransactions");
        if (!pendingTransactions || Object.keys(pendingTransactions).length === 0) {
            return;
        }
        const txHashes = Object.keys(pendingTransactions);
        // Limit concurrency for large batch of txs
        const concurrency = 5;
        const chunks = [];
        for (let i = 0; i < txHashes.length; i += concurrency) {
            chunks.push(txHashes.slice(i, i + concurrency));
        }
        for (const chunk of chunks) {
            const verificationPromises = chunk.map(async (txHash) => {
                var _a, _b, _c, _d;
                if (processingTransactions.has(txHash)) {
                    console.log(`Transaction ${txHash} already being processed.`);
                    return;
                }
                try {
                    const txDetails = pendingTransactions[txHash];
                    if (!txDetails) {
                        console.error(`Transaction ${txHash} not found in pending list.`);
                        return;
                    }
                    processingTransactions.add(txHash);
                    const chain = txDetails.chain;
                    let isConfirmed = false;
                    let updatedTxDetails = null;
                    if (["SOL", "TRON", "XMR", "TON"].includes(chain)) {
                        isConfirmed =
                            txDetails.status === "COMPLETED" ||
                                txDetails.status === "CONFIRMED";
                        updatedTxDetails = txDetails;
                    }
                    else if (["BTC", "LTC", "DOGE", "DASH"].includes(chain)) {
                        // UTXO chain verification
                        const data = await (0, utxo_1.verifyUTXOTransaction)(chain, txHash);
                        isConfirmed = data.confirmed;
                        updatedTxDetails = {
                            ...txDetails,
                            status: isConfirmed ? "COMPLETED" : "PENDING",
                        };
                    }
                    else {
                        // EVM-compatible chain verification
                        let provider = ProviderManager_1.chainProviders.get(chain);
                        if (!provider) {
                            provider = await (0, ProviderManager_1.initializeWebSocketProvider)(chain);
                            if (!provider) {
                                provider = await (0, ProviderManager_1.initializeHttpProvider)(chain);
                            }
                        }
                        if (!provider) {
                            console.error(`Provider not available for chain ${chain}`);
                            return; // Keep pending
                        }
                        try {
                            const receipt = await provider.getTransactionReceipt(txHash);
                            if (!receipt) {
                                console.log(`Transaction ${txHash} not yet confirmed.`);
                                return; // Keep in pending state
                            }
                            isConfirmed = receipt.status === 1;
                            updatedTxDetails = {
                                ...txDetails,
                                gasUsed: receipt.gasUsed.toString(),
                                status: isConfirmed ? "COMPLETED" : "FAILED",
                            };
                        }
                        catch (error) {
                            console.error(`Error fetching receipt for ${txHash}: ${error.message}`);
                            return; // Keep in pending state
                        }
                    }
                    if (isConfirmed && updatedTxDetails) {
                        try {
                            const response = await (0, wallet_1.handleEcosystemDeposit)(updatedTxDetails);
                            if (!response.transaction) {
                                console.log(`Transaction ${txHash} already processed or invalid. Removing.`);
                                delete pendingTransactions[txHash];
                                await (0, deposit_1.offloadToRedis)("pendingTransactions", pendingTransactions);
                                return;
                            }
                            const address = chain === "MO"
                                ? txDetails.to.toLowerCase()
                                : typeof txDetails.to === "string"
                                    ? txDetails.to
                                    : txDetails.address.toLowerCase();
                            (0, Websocket_1.sendMessageToRoute)("/api/ext/ecosystem/deposit", {
                                currency: (_a = response.wallet) === null || _a === void 0 ? void 0 : _a.currency,
                                chain,
                                address,
                            }, {
                                stream: "verification",
                                data: {
                                    status: 200,
                                    message: "Transaction completed",
                                    ...response,
                                    trx: updatedTxDetails,
                                    balance: (_b = response.wallet) === null || _b === void 0 ? void 0 : _b.balance,
                                    currency: (_c = response.wallet) === null || _c === void 0 ? void 0 : _c.currency,
                                    chain,
                                    method: "Wallet Deposit",
                                },
                            });
                            if (txDetails.contractType === "NO_PERMIT") {
                                (0, utils_1.unlockAddress)(txDetails.to);
                            }
                            if ((_d = response.wallet) === null || _d === void 0 ? void 0 : _d.userId) {
                                await (0, notifications_1.handleNotification)({
                                    userId: response.wallet.userId,
                                    title: "Deposit Confirmation",
                                    message: `Your deposit of ${updatedTxDetails === null || updatedTxDetails === void 0 ? void 0 : updatedTxDetails.amount} ${response.wallet.currency} has been confirmed`,
                                    type: "ACTIVITY",
                                });
                            }
                            delete pendingTransactions[txHash];
                            await (0, deposit_1.offloadToRedis)("pendingTransactions", pendingTransactions);
                        }
                        catch (error) {
                            console.error(`Error handling deposit for ${txHash}: ${error.message}`);
                            if (error.message.includes("already processed")) {
                                delete pendingTransactions[txHash];
                                await (0, deposit_1.offloadToRedis)("pendingTransactions", pendingTransactions);
                            }
                        }
                    }
                }
                catch (error) {
                    console.error(`Error verifying transaction ${txHash}: ${error.message}`);
                }
                finally {
                    processingTransactions.delete(txHash);
                }
            });
            await Promise.all(verificationPromises);
        }
    }
    catch (error) {
        console.error(`Error in verifyPendingTransactions: ${error.message}`);
    }
}
exports.verifyPendingTransactions = verifyPendingTransactions;
