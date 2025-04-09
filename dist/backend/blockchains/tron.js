"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tronweb_1 = require("tronweb");
const bip39_1 = require("bip39");
const ethers_1 = require("ethers");
const redis_1 = require("@b/utils/redis");
const date_fns_1 = require("date-fns");
const logger_1 = require("@b/utils/logger");
const encrypt_1 = require("@b/utils/encrypt");
const db_1 = require("@b/db");
const fs_1 = require("fs");
const deposit_1 = require("@b/utils/eco/redis/deposit");
class TronService {
    static cleanupProcessedTransactions() {
        const now = Date.now();
        for (const [tx, timestamp] of TronService.processedTransactions.entries()) {
            if (now - timestamp > TronService.PROCESSING_EXPIRY_MS) {
                TronService.processedTransactions.delete(tx);
            }
        }
    }
    // --- End added ---
    constructor(fullHost = TronService.getFullHostUrl(process.env.TRON_NETWORK || "mainnet"), cacheExpirationMinutes = 30) {
        this.chainActive = false;
        this.fullHost = fullHost;
        this.tronWeb = new tronweb_1.TronWeb({
            fullHost: this.fullHost,
            headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY || "" },
        });
        this.cacheExpiration = cacheExpirationMinutes;
    }
    static getFullHostUrl(network) {
        switch (network) {
            case "mainnet":
                return process.env.TRON_MAINNET_RPC || "https://api.trongrid.io";
            case "shasta":
                return process.env.TRON_SHASTA_RPC || "https://api.shasta.trongrid.io";
            case "nile":
                return process.env.TRON_NILE_RPC || "https://api.nileex.io";
            default:
                throw new Error(`Invalid Tron network: ${network}`);
        }
    }
    /**
     * Singleton instance accessor.
     */
    static async getInstance() {
        if (!TronService.instance) {
            TronService.instance = new TronService();
            await TronService.instance.checkChainStatus();
            // Schedule periodic cleanup of processed transactions
            setInterval(() => TronService.cleanupProcessedTransactions(), 60 * 1000);
        }
        return TronService.instance;
    }
    /**
     * Checks if the chain 'TRON' is active in the ecosystemBlockchain model.
     */
    async checkChainStatus() {
        try {
            const currentDir = __dirname; // Get current directory
            const files = (0, fs_1.readdirSync)(currentDir); // Read files in current directory
            // Check if any file starts with 'tron.bin'
            const tronBinFile = files.find((file) => file.startsWith("tron.bin"));
            if (tronBinFile) {
                this.chainActive = true; // Set chain as active if the file is found
                console.log("Chain 'TRON' is active based on local file check.");
            }
            else {
                console.error("Chain 'TRON' is not active in ecosystemBlockchain.");
            }
        }
        catch (error) {
            console.error(`Error checking chain status for 'TRON': ${error instanceof Error ? error.message : error}`);
            this.chainActive = false;
        }
    }
    /**
     * Throws an error if the chain is not active.
     */
    ensureChainActive() {
        if (!this.chainActive) {
            throw new Error("Chain 'TRON' is not active in ecosystemBlockchain.");
        }
    }
    /**
     * Creates a new Tron wallet.
     */
    createWallet() {
        this.ensureChainActive();
        const mnemonic = (0, bip39_1.generateMnemonic)();
        const path = "m/44'/195'/0'/0/0"; // Tron derivation path
        // Create the wallet directly from the mnemonic and path
        const wallet = ethers_1.ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, path);
        const privateKey = wallet.privateKey.replace(/^0x/, "");
        const publicKey = wallet.publicKey.replace(/^0x/, "");
        const address = tronweb_1.utils.address.fromPrivateKey(privateKey);
        return {
            address,
            data: {
                mnemonic,
                publicKey,
                privateKey,
                derivationPath: path,
            },
        };
    }
    /**
     * Fetches and parses transactions for a given Tron address.
     * Utilizes caching to optimize performance.
     * @param address Tron wallet address
     */
    async fetchTransactions(address) {
        try {
            const cacheKey = `wallet:${address}:transactions:tron`;
            const cachedData = await this.getCachedData(cacheKey);
            if (cachedData) {
                return cachedData;
            }
            const rawTransactions = await this.fetchTronTransactions(address);
            const parsedTransactions = this.parseTronTransactions(rawTransactions, address);
            const cacheData = {
                transactions: parsedTransactions,
                timestamp: new Date().toISOString(),
            };
            const redis = redis_1.RedisSingleton.getInstance();
            await redis.setex(cacheKey, this.cacheExpiration * 60, JSON.stringify(cacheData));
            return parsedTransactions;
        }
        catch (error) {
            (0, logger_1.logError)("tron_fetch_transactions", error, __filename);
            throw new Error(`Failed to fetch Tron transactions: ${error instanceof Error ? error.message : error}`);
        }
    }
    /**
     * Fetches transactions involving the given address by scanning new blocks.
     * @param address Tron wallet address
     */
    async fetchTronTransactions(address) {
        try {
            const transactions = [];
            const latestBlock = await this.tronWeb.trx.getCurrentBlock();
            const latestBlockNumber = latestBlock.block_header.raw_data.number;
            const lastScannedBlockNumber = TronService.lastScannedBlock.get(address) || latestBlockNumber - 1;
            if (latestBlockNumber <= lastScannedBlockNumber) {
                console.log(`No new blocks to scan for address ${address}`);
                return transactions;
            }
            const blocksToScan = [];
            for (let blockNum = lastScannedBlockNumber + 1; blockNum <= latestBlockNumber; blockNum++) {
                blocksToScan.push(blockNum);
            }
            console.log(`Scanning blocks ${lastScannedBlockNumber + 1} to ${latestBlockNumber} for address ${address}`);
            const batchSize = 10;
            for (let i = 0; i < blocksToScan.length; i += batchSize) {
                const batchBlocks = blocksToScan.slice(i, i + batchSize);
                const blockPromises = batchBlocks.map((blockNum) => this.tronWeb.trx.getBlock(blockNum));
                const blocks = await Promise.all(blockPromises);
                for (const block of blocks) {
                    if (block && block.transactions) {
                        for (const tx of block.transactions) {
                            if (tx.raw_data &&
                                tx.raw_data.contract &&
                                tx.raw_data.contract[0]) {
                                const contract = tx.raw_data.contract[0];
                                if (contract.type === "TransferContract") {
                                    const value = contract.parameter.value;
                                    const to = tronweb_1.utils.address.fromHex(value.to_address);
                                    if (to === address) {
                                        transactions.push(tx);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            TronService.lastScannedBlock.set(address, latestBlockNumber);
            console.log(`Fetched ${transactions.length} transactions for address ${address}`);
            return transactions;
        }
        catch (error) {
            console.error(`Failed to fetch Tron transactions: ${error instanceof Error ? error.message : error}`);
            return [];
        }
    }
    /**
     * Parses raw Tron transactions into a standardized format.
     * @param rawTransactions Raw transaction data from Tron
     * @param address Tron wallet address
     */
    parseTronTransactions(rawTransactions, address) {
        if (!Array.isArray(rawTransactions)) {
            throw new Error(`Invalid raw transactions format for Tron`);
        }
        return rawTransactions.map((tx) => {
            const hash = tx.txID;
            const timestamp = tx.raw_data.timestamp;
            let from = "";
            let to = "";
            let amount = "0";
            let fee = "0";
            let status = "Success";
            let isError = "0";
            let confirmations = "0";
            if (tx.ret && tx.ret[0] && tx.ret[0].contractRet !== "SUCCESS") {
                status = "Failed";
                isError = "1";
            }
            if (tx.raw_data && tx.raw_data.contract && tx.raw_data.contract[0]) {
                const contract = tx.raw_data.contract[0];
                if (contract.type === "TransferContract") {
                    const value = contract.parameter.value;
                    from = tronweb_1.utils.address.fromHex(value.owner_address);
                    to = tronweb_1.utils.address.fromHex(value.to_address);
                    amount = (value.amount / 1e6).toString();
                }
            }
            if (tx.ret && tx.ret[0] && tx.ret[0].fee) {
                fee = (tx.ret[0].fee / 1e6).toString();
            }
            else if (tx.fee) {
                fee = (tx.fee / 1e6).toString();
            }
            if (tx.blockNumber) {
                confirmations = tx.blockNumber.toString();
            }
            return {
                timestamp: new Date(timestamp).toISOString(),
                hash,
                from,
                to,
                amount,
                confirmations,
                status,
                isError,
                fee,
            };
        });
    }
    /**
     * Retrieves the balance of a Tron wallet.
     * Utilizes caching to optimize performance.
     * @param address Tron wallet address
     */
    async getBalance(address) {
        try {
            const balanceSun = await this.tronWeb.trx.getBalance(address);
            const balanceTRX = (balanceSun / 1e6).toString();
            return balanceTRX;
        }
        catch (error) {
            console.error(`Failed to fetch Tron balance: ${error instanceof Error ? error.message : error}`);
            throw error;
        }
    }
    /**
     * Retrieves cached transaction data if available and not expired.
     * @param cacheKey Redis cache key
     */
    async getCachedData(cacheKey) {
        const redis = redis_1.RedisSingleton.getInstance();
        let cachedData = await redis.get(cacheKey);
        if (cachedData && typeof cachedData === "string") {
            cachedData = JSON.parse(cachedData);
        }
        if (cachedData) {
            const now = new Date();
            const lastUpdated = new Date(cachedData.timestamp);
            if ((0, date_fns_1.differenceInMinutes)(now, lastUpdated) < this.cacheExpiration) {
                return cachedData.transactions;
            }
        }
        return null;
    }
    /**
     * Monitors Tron deposits by periodically checking for new transactions.
     * Instead of stopping monitoring after processing one deposit, this version
     * continues to check and process any new deposits while ignoring duplicates.
     * @param wallet Wallet attributes
     * @param address Tron wallet address
     */
    async monitorTronDeposits(wallet, address) {
        const monitoringKey = `${wallet.id}_${address}`;
        if (TronService.monitoringAddresses.has(monitoringKey)) {
            console.log(`[INFO] Monitoring already in progress for wallet ${wallet.id} on address ${address}`);
            return;
        }
        TronService.monitoringAddresses.set(monitoringKey, true);
        try {
            console.log(`[INFO] Starting block scanning for wallet ${wallet.id} on address ${address}`);
            const checkDeposits = async () => {
                console.log(`[DEBUG] checkDeposits called for address ${address}`);
                try {
                    const rawTransactions = await this.fetchTronTransactions(address);
                    const transactions = this.parseTronTransactions(rawTransactions, address);
                    // Filter for deposits (to address equals given address, and status "Success")
                    const deposits = transactions.filter((tx) => tx.to === address && tx.status === "Success");
                    console.log(`Found ${deposits.length} deposits for address ${address}`);
                    for (const deposit of deposits) {
                        // Check if deposit already exists in DB or was processed recently
                        const existingTx = await db_1.models.transaction.findOne({
                            where: { referenceId: deposit.hash },
                        });
                        const processedTimestamp = TronService.processedTransactions.get(deposit.hash);
                        if (existingTx ||
                            (processedTimestamp &&
                                Date.now() - processedTimestamp <
                                    TronService.PROCESSING_EXPIRY_MS)) {
                            continue;
                        }
                        // Process the deposit and mark it as processed
                        await this.processTronTransaction(deposit.hash, wallet, address);
                        TronService.processedTransactions.set(deposit.hash, Date.now());
                    }
                }
                catch (error) {
                    console.error(`[ERROR] Error checking deposits for ${address}: ${error instanceof Error ? error.message : error}`);
                }
                // Schedule next check in 1 minute
                setTimeout(checkDeposits, 60 * 1000);
            };
            // Start immediately
            checkDeposits();
        }
        catch (error) {
            console.error(`[ERROR] Error monitoring Tron deposits for ${address}: ${error instanceof Error ? error.message : error}`);
            TronService.monitoringAddresses.delete(monitoringKey);
        }
    }
    /**
     * Processes a Tron transaction by storing and broadcasting it.
     * @param transactionHash Transaction hash
     * @param wallet Wallet attributes
     * @param address Tron wallet address
     */
    async processTronTransaction(transactionHash, wallet, address) {
        try {
            console.log(`[INFO] Fetching transaction ${transactionHash} for address ${address}`);
            const transactionInfo = await this.tronWeb.trx.getTransactionInfo(transactionHash);
            if (!transactionInfo) {
                console.error(`[ERROR] Transaction ${transactionHash} not found on Tron blockchain`);
                return;
            }
            const txDetails = await this.tronWeb.trx.getTransaction(transactionHash);
            if (!txDetails) {
                console.error(`[ERROR] Transaction details not found for ${transactionHash}`);
                return;
            }
            let from = "";
            let to = "";
            let amount = "0";
            let fee = "0";
            if (txDetails.raw_data &&
                txDetails.raw_data.contract &&
                txDetails.raw_data.contract[0]) {
                const contract = txDetails.raw_data.contract[0];
                if (contract.type === "TransferContract") {
                    const value = contract.parameter.value;
                    from = tronweb_1.utils.address.fromHex(value.owner_address);
                    to = tronweb_1.utils.address.fromHex(value.to_address);
                    amount = (value.amount / 1e6).toString(); // TRX has 6 decimals
                }
            }
            if (transactionInfo.fee) {
                fee = (transactionInfo.fee / 1e6).toString();
            }
            const txData = {
                contractType: "NATIVE",
                id: wallet.id,
                chain: "TRON",
                hash: transactionHash,
                type: "DEPOSIT",
                from,
                address: address,
                amount,
                fee,
                status: "COMPLETED",
            };
            console.log(`[INFO] Storing and broadcasting transaction ${transactionHash} for wallet ${wallet.id}`);
            await (0, deposit_1.storeAndBroadcastTransaction)(txData, transactionHash);
            console.log(`[SUCCESS] Processed Tron transaction ${transactionHash}`);
        }
        catch (error) {
            console.error(`[ERROR] Error processing Tron transaction ${transactionHash}: ${error instanceof Error ? error.message : error}`);
        }
    }
    /**
     * Handles Tron withdrawal by transferring TRX to the specified address.
     * @param transactionId Transaction ID
     * @param walletId Wallet ID
     * @param amount Amount in TRX
     * @param toAddress Recipient's Tron address
     */
    async handleTronWithdrawal(transactionId, walletId, amount, toAddress) {
        try {
            const amountSun = Math.round(amount * 1e6);
            const transactionSignature = await this.transferTrx(walletId, toAddress, amountSun);
            if (transactionSignature) {
                await db_1.models.transaction.update({ status: "COMPLETED", referenceId: transactionSignature }, { where: { id: transactionId } });
            }
            else {
                throw new Error("Failed to receive transaction signature");
            }
        }
        catch (error) {
            console.error(`Failed to execute Tron withdrawal: ${error instanceof Error ? error.message : error}`);
            await db_1.models.transaction.update({
                status: "FAILED",
                description: `Withdrawal failed: ${error instanceof Error ? error.message : error}`,
            }, { where: { id: transactionId } });
            throw error;
        }
    }
    /**
     * Checks if a TRON address is activated.
     * @param address TRON address to check
     */
    async isAddressActivated(address) {
        try {
            const account = await this.tronWeb.trx.getAccount(address);
            return account && account.address ? true : false;
        }
        catch (error) {
            console.error(`Error checking if address ${address} is activated: ${error.message}`);
            return false;
        }
    }
    /**
     * Estimates the transaction fee for sending TRX.
     * @param fromAddress Sender's TRON address
     * @param toAddress Recipient's TRON address
     * @param amountSun Amount in Sun
     */
    async estimateTransactionFee(fromAddress, toAddress, amountSun) {
        try {
            const transaction = await this.tronWeb.transactionBuilder.sendTrx(toAddress, amountSun, fromAddress);
            const bandwidthNeeded = Math.ceil(JSON.stringify(transaction).length / 2);
            const bandwidth = await this.tronWeb.trx.getBandwidth(fromAddress);
            const bandwidthDeficit = Math.max(0, bandwidthNeeded - bandwidth);
            const feeSun = bandwidthDeficit * 10000;
            return feeSun;
        }
        catch (error) {
            console.error(`Error estimating transaction fee: ${error.message}`);
            return 0;
        }
    }
    /**
     * Transfers TRX from the custodial wallet to a recipient using the wallet's ID.
     * @param walletId ID of the wallet performing the transfer
     * @param toAddress Recipient's Tron address
     * @param amount Amount of TRX to transfer (in Sun)
     */
    async transferTrx(walletId, toAddress, amount) {
        try {
            const walletData = await db_1.models.walletData.findOne({
                where: { walletId, currency: "TRX", chain: "TRON" },
            });
            if (!walletData || !walletData.data) {
                throw new Error("Private key not found for the wallet");
            }
            const decryptedWalletData = JSON.parse((0, encrypt_1.decrypt)(walletData.data));
            const privateKey = decryptedWalletData.privateKey.replace(/^0x/, "");
            const tronWeb = new tronweb_1.TronWeb({
                fullHost: this.fullHost,
                privateKey: privateKey,
                headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY || "" },
            });
            const fromAddress = tronWeb.defaultAddress.base58;
            if (!fromAddress) {
                throw new Error("Default address is not set");
            }
            const tradeobj = await tronWeb.transactionBuilder.sendTrx(toAddress, amount, fromAddress);
            const signedTxn = await tronWeb.trx.sign(tradeobj);
            const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);
            if (receipt.result && receipt.result === true) {
                console.log(`Transaction successful with ID: ${receipt.txid}`);
                return receipt.txid;
            }
            else {
                throw new Error(`Transaction failed: ${JSON.stringify(receipt)}`);
            }
        }
        catch (error) {
            (0, logger_1.logError)("tron_transfer_trx", error, __filename);
            throw new Error(`Failed to transfer TRX: ${error instanceof Error ? error.message : error}`);
        }
    }
}
TronService.monitoringAddresses = new Map();
TronService.lastScannedBlock = new Map();
// --- Added for deposit tracking ---
TronService.processedTransactions = new Map();
TronService.PROCESSING_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
exports.default = TronService;
