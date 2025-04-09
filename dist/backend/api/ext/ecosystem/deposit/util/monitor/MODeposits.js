"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODeposits = void 0;
const ethers_1 = require("ethers");
const ProviderManager_1 = require("../ProviderManager");
const tokens_1 = require("@b/utils/eco/tokens");
const chains_1 = require("@b/utils/eco/chains");
const DepositUtils_1 = require("../DepositUtils");
class MODeposits {
    constructor(options) {
        this.intervalId = null;
        this.cleanupIntervalId = null;
        this.pollingIntervalMs = 10000; // 10 seconds
        this.maxBlocksPerPoll = 5000;
        this.backoffAttempts = 0;
        this.maxBackoffAttempts = 5;
        this.processedTxs = new Map();
        this.PROCESSING_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
        this.wallet = options.wallet;
        this.chain = options.chain;
        this.currency = options.currency;
        this.address = options.address;
        this.contractType = options.contractType;
    }
    async watchDeposits() {
        let provider = ProviderManager_1.chainProviders.get(this.chain);
        if (!provider) {
            provider = await (0, ProviderManager_1.initializeHttpProvider)(this.chain);
            if (!provider) {
                throw new Error(`Failed to initialize HTTP provider for chain ${this.chain}`);
            }
        }
        console.log(`Using polling for ${this.chain} ERC-20 deposits on address ${this.address}`);
        const token = await (0, tokens_1.getEcosystemToken)(this.chain, this.currency);
        if (!token)
            throw new Error(`Token ${this.currency} not found for chain ${this.chain}`);
        const decimals = token.decimals;
        const filter = {
            address: token.contract,
            topics: [
                ethers_1.ethers.id("Transfer(address,address,uint256)"),
                null,
                ethers_1.ethers.zeroPadValue(this.address, 32),
            ],
        };
        // Start polling for events
        await this.pollForEvents(provider, filter, decimals);
        // Schedule periodic cleanup of processed transactions and store the interval ID
        this.cleanupIntervalId = setInterval(() => this.cleanupProcessedTxs(), 60 * 1000);
    }
    cleanupProcessedTxs() {
        const now = Date.now();
        for (const [txHash, timestamp] of this.processedTxs.entries()) {
            if (now - timestamp > this.PROCESSING_EXPIRY_MS) {
                this.processedTxs.delete(txHash);
            }
        }
    }
    async pollForEvents(provider, filter, decimals) {
        const pollingKey = `${this.chain}:${this.address}`;
        let lastBlock;
        try {
            lastBlock = await provider.getBlockNumber();
        }
        catch (err) {
            console.error(`Failed to get initial block number for ${pollingKey}: ${err.message}`);
            throw err;
        }
        this.intervalId = setInterval(async () => {
            try {
                const currentBlock = await provider.getBlockNumber();
                if (currentBlock > lastBlock) {
                    const fromBlock = lastBlock + 1;
                    const toBlock = Math.min(currentBlock, fromBlock + this.maxBlocksPerPoll - 1);
                    console.log(`Polling ${pollingKey} from block ${fromBlock} to ${toBlock}`);
                    const logs = await provider.getLogs({
                        ...filter,
                        fromBlock,
                        toBlock,
                    });
                    this.backoffAttempts = 0;
                    for (const log of logs) {
                        if (this.processedTxs.has(log.transactionHash))
                            continue;
                        console.log(`New event detected on ${pollingKey}: TxHash=${log.transactionHash}`);
                        const success = await (0, DepositUtils_1.processTransaction)(this.contractType, log.transactionHash, provider, this.address, this.chain, decimals, chains_1.chainConfigs[this.chain].decimals, this.wallet.id);
                        if (success) {
                            console.log(`Deposit recorded for ${pollingKey}.`);
                            this.processedTxs.set(log.transactionHash, Date.now());
                        }
                    }
                    lastBlock = toBlock;
                }
            }
            catch (error) {
                console.error(`Error during event polling for ${pollingKey}:`, error.message);
                this.backoffAttempts++;
                if (this.backoffAttempts > this.maxBackoffAttempts) {
                    console.error(`Max backoff attempts reached for ${pollingKey}. Stopping polling.`);
                    this.stopPolling();
                    return;
                }
                const backoffTime = this.pollingIntervalMs * Math.pow(2, this.backoffAttempts);
                console.warn(`Backing off polling for ${pollingKey}. Next poll in ${backoffTime}ms`);
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
                setTimeout(() => {
                    this.pollForEvents(provider, filter, decimals);
                }, backoffTime);
            }
        }, this.pollingIntervalMs);
    }
    // New stopPolling method that clears both polling and cleanup intervals
    stopPolling() {
        if (this.intervalId) {
            console.log(`Stopping polling for ${this.chain}:${this.address}`);
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.cleanupIntervalId) {
            clearInterval(this.cleanupIntervalId);
            this.cleanupIntervalId = null;
        }
    }
}
exports.MODeposits = MODeposits;
