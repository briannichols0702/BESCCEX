"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUTXOWithdrawal = exports.getCurrentUtxoFeeRatePerByte = exports.calculateUTXOFee = exports.broadcastRawUtxoTransaction = exports.verifyUTXOTransaction = exports.fetchUtxoTransaction = exports.fetchRawUtxoTransaction = exports.fetchUTXOWalletBalance = exports.fetchUTXOTransactions = exports.createUTXOWallet = exports.recordUTXO = exports.createTransactionDetailsForUTXO = exports.cancelWatchAddress = exports.watchAddressBlockCypher = void 0;
const assert = __importStar(require("assert"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const ecpair_1 = __importDefault(require("ecpair"));
const ecc = __importStar(require("tiny-secp256k1"));
const ws_1 = __importDefault(require("ws"));
const blockchain_1 = require("./blockchain");
const db_1 = require("@b/db");
const encrypt_1 = require("../encrypt");
const wallet_1 = require("./wallet");
const logger_1 = require("@b/utils/logger");
class TransactionBroadcastedError extends Error {
    constructor(message, txid) {
        super(message);
        this.name = "TransactionBroadcastedError";
        this.txid = txid;
    }
}
const HTTP_TIMEOUT = 30000;
const BLOCKCYPHER_API_URL = "https://api.blockcypher.com/v1";
const BTC_NETWORK = process.env.BTC_NETWORK || "mainnet";
const BLOCKCYPHER_TOKEN = process.env.BLOCKCYPHER_TOKEN;
const BTC_NODE = process.env.BTC_NODE || "blockcypher";
const LTC_NODE = process.env.LTC_NODE || "blockcypher";
const DOGE_NODE = process.env.DOGE_NODE || "blockcypher";
const DASH_NODE = process.env.DASH_NODE || "blockcypher";
const wsConnections = new Map();
bitcoin.initEccLib(ecc);
const ECPair = (0, ecpair_1.default)(ecc);
function getUtxoNetwork(chain) {
    switch (chain) {
        case "BTC":
            return BTC_NETWORK === "mainnet"
                ? bitcoin.networks.bitcoin
                : bitcoin.networks.testnet;
        case "LTC":
            return blockchain_1.litecoinNetwork;
        case "DOGE":
            return blockchain_1.dogecoinNetwork;
        case "DASH":
            return blockchain_1.dashNetwork;
        default:
            throw new Error(`Unsupported UTXO chain: ${chain}`);
    }
}
const getUtxoProvider = (chain) => {
    switch (chain) {
        case "BTC":
            return BTC_NODE;
        case "LTC":
            return LTC_NODE;
        case "DOGE":
            return DOGE_NODE;
        case "DASH":
            return DASH_NODE;
        default:
            return "blockcypher";
    }
};
const providers = {
    haskoin: {
        BTC: `https://api.haskoin.com/btc${BTC_NETWORK === "mainnet" ? "" : "test"}`,
    },
    blockcypher: {
        BTC: `https://api.blockcypher.com/v1/btc/${BTC_NETWORK === "mainnet" ? "main" : "test3"}`,
        LTC: "https://api.blockcypher.com/v1/ltc/main",
        DASH: "https://api.blockcypher.com/v1/dash/main",
        DOGE: "https://api.blockcypher.com/v1/doge/main",
    },
};
const watchAddressBlockCypher = (chain, address, callback) => {
    const network = chain === "BTC" ? (BTC_NETWORK === "mainnet" ? "main" : "test3") : "main";
    const ws = new ws_1.default(`wss://socket.blockcypher.com/v1/${chain.toLowerCase()}/${network}?token=${BLOCKCYPHER_TOKEN}`);
    ws.on("open", function open() {
        ws.send(JSON.stringify({ event: "unconfirmed-tx", address: address }));
    });
    ws.on("message", function incoming(data) {
        const messageString = data.toString();
        const message = JSON.parse(messageString);
        if (message && message.hash) {
            callback(message);
            (0, exports.cancelWatchAddress)(chain, address); // Close the WebSocket after receiving the transaction
        }
    });
    ws.on("close", function close() {
        console.log(`WebSocket disconnected from ${chain} address: ${address}`);
    });
    ws.on("error", function error(err) {
        (0, logger_1.logError)("watch_address_blockcypher", err, __filename);
    });
    const wsKey = `${chain}_${address.toLowerCase()}`;
    wsConnections.set(wsKey, ws);
};
exports.watchAddressBlockCypher = watchAddressBlockCypher;
const cancelWatchAddress = (chain, address) => {
    const wsKey = `${chain}_${address.toLowerCase()}`;
    const ws = wsConnections.get(wsKey);
    if (ws) {
        try {
            ws.close();
            console.log(`WebSocket for ${chain} address ${address} has been successfully closed.`);
        }
        catch (error) {
            (0, logger_1.logError)("cancel_watch_address", error, __filename);
        }
        finally {
            wsConnections.delete(wsKey);
        }
    }
    else {
        console.log(`No active WebSocket found for ${chain} address ${address}.`);
    }
};
exports.cancelWatchAddress = cancelWatchAddress;
async function createTransactionDetailsForUTXO(id, transaction, address, chain) {
    const txHash = transaction.hash;
    const inputs = transaction.inputs.map((input) => ({
        prevHash: input.prev_hash,
        outputIndex: input.output_index,
        value: (0, blockchain_1.satoshiToStandardUnit)(input.output_value, chain),
        addresses: input.addresses,
        script: input.script,
    }));
    const outputs = transaction.outputs
        .filter((output) => output.addresses.includes(address))
        .map((output) => ({
        value: (0, blockchain_1.satoshiToStandardUnit)(output.value, chain),
        addresses: output.addresses,
        script: output.script,
    }));
    const amount = outputs.reduce((acc, output) => acc + output.value, 0);
    const txDetails = {
        id,
        address,
        chain,
        hash: txHash,
        from: inputs.map((input) => input.addresses).flat(),
        to: outputs.map((output) => output.addresses).flat(),
        amount,
        inputs,
        outputs,
    };
    return txDetails;
}
exports.createTransactionDetailsForUTXO = createTransactionDetailsForUTXO;
async function recordUTXO(walletId, transactionId, index, amount, script, status) {
    await db_1.models.ecosystemUtxo.create({
        walletId: walletId,
        transactionId: transactionId,
        index: index,
        amount: amount,
        script: script,
        status: status,
    });
}
exports.recordUTXO = recordUTXO;
const constructApiUrl = (chain, operation, address = "", txHash = "", provider = "") => {
    if (provider === "")
        provider = getUtxoProvider(chain);
    switch (provider) {
        case "haskoin": {
            const haskoinBaseURL = providers.haskoin[chain];
            switch (operation) {
                case "fetchBalance":
                    return `${haskoinBaseURL}/address/${address}/balance`;
                case "fetchTransactions":
                    return `${haskoinBaseURL}/address/${address}/transactions/full`;
                case "fetchTransaction":
                    return `${haskoinBaseURL}/transaction/${txHash}`;
                case "fetchRawTransaction":
                    return `${haskoinBaseURL}/transaction/${txHash}/raw`;
                case "broadcastTransaction":
                    return `${haskoinBaseURL}/transactions/full`;
                default:
                    throw new Error(`Unsupported operation for Haskoin: ${operation}`);
            }
        }
        case "blockcypher":
        default: {
            const blockcypherBaseURL = providers.blockcypher[chain];
            switch (operation) {
                case "fetchBalance":
                    return `${blockcypherBaseURL}/addrs/${address}/balance`;
                case "fetchTransactions":
                    return `${blockcypherBaseURL}/addrs/${address}`;
                case "fetchTransaction":
                    return `${blockcypherBaseURL}/txs/${txHash}`;
                case "fetchRawTransaction":
                    return `${blockcypherBaseURL}/txs/${txHash}?includeHex=true`;
                case "broadcastTransaction":
                    return `${blockcypherBaseURL}/txs/push`;
                default:
                    throw new Error(`Unsupported operation for BlockCypher: ${operation}`);
            }
        }
    }
};
const fetchFromApi = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!data || typeof data !== "object") {
            throw new Error("Invalid response structure");
        }
        return data;
    }
    catch (error) {
        (0, logger_1.logError)("fetch_from_api", error, __filename);
        throw error;
    }
};
const createUTXOWallet = (chain) => {
    const network = getUtxoNetwork(chain);
    if (!network) {
        throw new Error(`Unsupported UTXO chain: ${chain}`);
    }
    const keyPair = ECPair.makeRandom({ network });
    const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network,
    });
    if (chain === "BTC" && network === bitcoin.networks.testnet) {
        assert.strictEqual(address.startsWith("m") || address.startsWith("n"), true);
    }
    const privateKey = keyPair.toWIF();
    return {
        address,
        data: {
            privateKey,
        },
    };
};
exports.createUTXOWallet = createUTXOWallet;
const fetchUTXOTransactions = async (chain, address) => {
    const url = constructApiUrl(chain, "fetchTransactions", address, "");
    const data = await fetchFromApi(url, { timeout: HTTP_TIMEOUT });
    const provider = getUtxoProvider(chain);
    switch (provider) {
        case "haskoin":
            return data.map((tx) => {
                var _a;
                return ({
                    hash: tx.txid,
                    blockHeight: (_a = tx.block) === null || _a === void 0 ? void 0 : _a.height,
                    value: tx.outputs.reduce((sum, output) => sum + output.value, 0),
                    confirmedTime: new Date(tx.time * 1000).toISOString(),
                    spent: tx.outputs.some((output) => output.spent),
                    confirmations: tx.block ? -tx.block.height : 0,
                    inputs: tx.inputs,
                    outputs: tx.outputs.map((output) => ({
                        address: output.addresses,
                        value: output.value,
                        spent: output.spent,
                        spender: output.spender ? output.spender.txid : null,
                    })),
                });
            });
        case "blockcypher":
        default:
            if (!Array.isArray(data.txrefs)) {
                return [];
            }
            return data.txrefs.map((tx) => ({
                hash: tx.tx_hash,
                blockHeight: tx.block_height,
                value: tx.value,
                confirmedTime: tx.confirmed,
                spent: tx.spent,
                confirmations: tx.confirmations,
            }));
    }
};
exports.fetchUTXOTransactions = fetchUTXOTransactions;
const fetchUTXOWalletBalance = async (chain, address) => {
    const url = constructApiUrl(chain, "fetchBalance", address, "");
    const data = await fetchFromApi(url);
    if (data.error) {
        (0, logger_1.logError)("fetch_utxo_wallet_balance", new Error(data.error), __filename);
        return 0;
    }
    const provider = getUtxoProvider(chain);
    let balance;
    switch (provider) {
        case "haskoin":
            balance = Number(data.confirmed) + Number(data.unconfirmed);
            return parseFloat(balance) > 0
                ? (0, blockchain_1.satoshiToStandardUnit)(balance, chain)
                : 0;
        case "blockcypher":
        default:
            balance = Number(data.final_balance);
            return parseFloat(balance) > 0
                ? (0, blockchain_1.satoshiToStandardUnit)(balance, chain)
                : 0;
    }
};
exports.fetchUTXOWalletBalance = fetchUTXOWalletBalance;
const fetchRawUtxoTransaction = async (txHash, chain) => {
    const provider = getUtxoProvider(chain);
    const apiURL = constructApiUrl(chain, "fetchRawTransaction", "", txHash);
    try {
        const data = await fetchFromApi(apiURL, { timeout: HTTP_TIMEOUT });
        switch (provider) {
            case "haskoin":
                if (!data.result) {
                    throw new Error("Missing hex data in response");
                }
                return data.result;
            case "blockcypher":
            default:
                if (!data.hex) {
                    throw new Error("Missing hex data in response");
                }
                return data.hex;
        }
    }
    catch (error) {
        (0, logger_1.logError)("fetch_raw_utxo_transaction", error, __filename);
        throw error;
    }
};
exports.fetchRawUtxoTransaction = fetchRawUtxoTransaction;
const fetchUtxoTransaction = async (txHash, chain) => {
    const provider = getUtxoProvider(chain);
    const apiURL = constructApiUrl(chain, "fetchTransaction", "", txHash);
    const maxRetries = 10; // Maximum number of retries
    const retryDelay = 30000; // 30 seconds delay between retries
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const data = await fetchFromApi(apiURL, { timeout: HTTP_TIMEOUT });
            if (data.error && provider === "haskoin") {
                if (data.error === "not-found-or-invalid-arg" && attempt < maxRetries) {
                    console.log(`Attempt ${attempt}: Transaction not found, retrying in ${retryDelay / 1000} seconds...`);
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                    continue; // Retry
                }
                throw new Error(data.message); // Throw error for other cases
            }
            return formatTransactionData(data, provider);
        }
        catch (error) {
            (0, logger_1.logError)("fetch_utxo_transaction", error, __filename);
            if (attempt === maxRetries)
                throw error; // Throw error after final attempt
        }
    }
};
exports.fetchUtxoTransaction = fetchUtxoTransaction;
function formatTransactionData(data, provider) {
    var _a;
    switch (provider) {
        case "haskoin":
            return {
                hash: data.txid,
                block_height: (_a = data.block) === null || _a === void 0 ? void 0 : _a.height,
                inputs: data.inputs,
                outputs: data.outputs.map((output) => ({
                    addresses: [output.addresses],
                    script: output.pkscript,
                    value: output.value,
                    spent: output.spent,
                    spender: output.spender,
                })),
            };
        case "blockcypher":
        default:
            return {
                hash: data.hash,
                block_height: data.block_height,
                inputs: data.inputs,
                outputs: data.outputs.map((output) => ({
                    addresses: output.addresses,
                    script: output.script,
                    value: output.value,
                    spender: output.spent_by,
                })),
            };
    }
}
const verifyUTXOTransaction = async (chain, txHash) => {
    const url = constructApiUrl(chain, "fetchTransaction", "", txHash);
    const startTime = Date.now();
    const maxDuration = 1800 * 1000; // 30 minutes in milliseconds
    const retryInterval = 30 * 1000; // 30 seconds in milliseconds
    const provider = getUtxoProvider(chain);
    while (Date.now() - startTime < maxDuration) {
        try {
            const txData = await fetchFromApi(url);
            let confirmed = false;
            let fee = 0;
            switch (provider) {
                case "haskoin":
                    confirmed = !!txData.block;
                    fee = txData.fee;
                    break;
                case "blockcypher":
                default:
                    confirmed = txData.confirmations >= 1;
                    fee = txData.fee ? (0, blockchain_1.satoshiToStandardUnit)(txData.fee, chain) : 0;
                    break;
            }
            if (confirmed) {
                return { confirmed, fee };
            }
        }
        catch (error) {
            (0, logger_1.logError)("verify_utxo_transaction", error, __filename);
        }
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
    return { confirmed: false, fee: 0 };
};
exports.verifyUTXOTransaction = verifyUTXOTransaction;
const broadcastRawUtxoTransaction = async (rawTxHex, chain) => {
    if (!rawTxHex) {
        console.error("Error broadcasting transaction: No transaction data provided");
        return {
            success: false,
            error: "No transaction data provided",
            txid: null,
        };
    }
    try {
        const apiUrl = constructApiUrl(chain, "broadcastTransaction", "", "", "blockcypher");
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tx: rawTxHex }),
        });
        const data = await response.json();
        if (!response.ok || !data || !data.tx) {
            throw new Error((data === null || data === void 0 ? void 0 : data.error) || "Transaction broadcast failed");
        }
        if (!data.tx.hash) {
            throw new Error("Transaction broadcast failed: No transaction ID returned");
        }
        return { success: true, txid: data.tx.hash };
    }
    catch (error) {
        (0, logger_1.logError)("broadcast_raw_utxo_transaction", error, __filename);
        return { success: false, error: error.message, txid: null };
    }
};
exports.broadcastRawUtxoTransaction = broadcastRawUtxoTransaction;
const calculateUTXOFee = async (toAddress, amount, chain) => {
    const feeRatePerByte = await getCurrentUtxoFeeRatePerByte(chain);
    if (!feeRatePerByte) {
        throw new Error("Failed to fetch current fee rate");
    }
    const inputs = [];
    const outputs = [];
    let totalInputValue = 0;
    const utxos = await db_1.models.ecosystemUtxo.findAll({
        where: { status: false },
        order: [["amount", "DESC"]],
    });
    if (utxos.length === 0)
        throw new Error("No UTXOs available for withdrawal");
    for (const utxo of utxos) {
        inputs.push(utxo);
        totalInputValue += utxo.amount;
        if (totalInputValue >= amount) {
            break;
        }
    }
    outputs.push({ toAddress, amount });
    const estimatedTxSize = inputs.length * 180 + outputs.length * 34 + 10;
    const transactionFee = estimatedTxSize * feeRatePerByte;
    return transactionFee;
};
exports.calculateUTXOFee = calculateUTXOFee;
async function getCurrentUtxoFeeRatePerByte(chain) {
    let url;
    switch (chain) {
        case "BTC":
            url = "https://api.blockchain.info/mempool/fees";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching fee rate for ${chain}: ${response.statusText}`);
                }
                const data = await response.json();
                // You can choose between 'regular' and 'priority' based on your needs
                const btcFeeRatePrioriy = process.env.BTC_FEE_RATE_PRIORITY || "regular";
                const feeRatePerByte = data[btcFeeRatePrioriy];
                return feeRatePerByte;
            }
            catch (error) {
                (0, logger_1.logError)("get_current_utxo_fee_rate_per_byte", error, __filename);
                return null;
            }
        case "LTC":
            url = `${BLOCKCYPHER_API_URL}/ltc/main`;
            break;
        case "DOGE":
            url = `${BLOCKCYPHER_API_URL}/doge/main`;
            break;
        default:
            throw new Error(`Unsupported UTXO chain: ${chain}`);
    }
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching fee rate for ${chain}: ${response.statusText}`);
        }
        const data = await response.json();
        const mediumFeePerKb = data.medium_fee_per_kb || data.medium_fee_per_kbyte;
        const feeRatePerByte = mediumFeePerKb / 1024;
        return feeRatePerByte;
    }
    catch (error) {
        (0, logger_1.logError)("get_current_utxo_fee_rate_per_byte", error, __filename);
        return null;
    }
}
exports.getCurrentUtxoFeeRatePerByte = getCurrentUtxoFeeRatePerByte;
async function handleUTXOWithdrawal(transaction) {
    const metadata = typeof transaction.metadata === "string"
        ? JSON.parse(transaction.metadata)
        : transaction.metadata;
    const chain = metadata.chain;
    const toAddress = metadata.toAddress;
    const amountToSend = (0, blockchain_1.standardUnitToSatoshi)(transaction.amount, chain);
    const flatFee = (0, blockchain_1.standardUnitToSatoshi)(transaction.fee, chain);
    const wallet = await db_1.models.wallet.findByPk(transaction.walletId);
    if (!wallet)
        throw new Error("Wallet not found");
    const masterWallet = (await (0, wallet_1.getMasterWalletByChain)(chain));
    if (!masterWallet)
        throw new Error(`Master wallet not found for ${chain}`);
    const network = getUtxoNetwork(chain);
    if (!network)
        throw new Error(`Unsupported UTXO chain: ${chain}`);
    const currentFeeRatePerByte = await getCurrentUtxoFeeRatePerByte(chain);
    if (!currentFeeRatePerByte) {
        throw new Error("Failed to fetch current fee rate");
    }
    // Define the dust threshold for the chain
    function getDustThreshold(chain) {
        switch (chain) {
            case "BTC":
                return 546; // Satoshis for P2PKH
            case "LTC":
                return 1000; // Adjust according to LTC standards
            case "DOGE":
                return 100000000; // DOGE has different units
            case "DASH":
                return 546; // Similar to BTC
            default:
                throw new Error(`Unsupported UTXO chain: ${chain}`);
        }
    }
    const dustThreshold = getDustThreshold(chain);
    if (amountToSend < dustThreshold) {
        throw new Error(`Amount to send (${amountToSend} satoshis) is below the dust threshold of ${dustThreshold} satoshis.`);
    }
    // Retry mechanism
    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount < maxRetries) {
        const utxos = await db_1.models.ecosystemUtxo.findAll({
            where: { status: false, walletId: wallet.id },
            order: [["amount", "DESC"]],
        });
        if (utxos.length === 0)
            throw new Error("No UTXOs available for withdrawal");
        try {
            const { success, txid } = await createAndBroadcastTransaction(utxos, wallet, transaction, amountToSend, flatFee, currentFeeRatePerByte, dustThreshold, chain, network, toAddress);
            if (success) {
                // Transaction broadcasted successfully
                await db_1.models.transaction.update({
                    status: "COMPLETED",
                    description: `Withdrawal of ${transaction.amount} ${wallet.currency} to ${toAddress}`,
                    referenceId: txid,
                }, {
                    where: { id: transaction.id },
                });
                return { success: true, txid };
            }
            else {
                throw new Error("Transaction failed without specific error");
            }
        }
        catch (error) {
            if (error instanceof TransactionBroadcastedError) {
                // Transaction was broadcasted; update status and exit
                await db_1.models.transaction.update({
                    status: "COMPLETED",
                    description: `Withdrawal of ${transaction.amount} ${wallet.currency} to ${toAddress}`,
                    referenceId: error.txid,
                }, {
                    where: { id: transaction.id },
                });
                // Optionally log the error
                (0, logger_1.logError)("post_broadcast_error", error, __filename);
                return { success: true, txid: error.txid };
            }
            else if (error.message.includes("already been spent") ||
                error.message.includes("Missing inputs") ||
                error.message.includes("bad-txns-inputs-spent")) {
                // Identify and mark the spent UTXOs
                await markSpentUtxosFromError(error, chain, wallet.id);
                retryCount++;
                if (retryCount >= maxRetries) {
                    throw new Error(`Failed to broadcast transaction after ${maxRetries} attempts due to spent UTXOs.`);
                }
                // Retry after marking spent UTXOs
                continue;
            }
            else {
                // For other errors, throw immediately
                throw new Error(`Failed to broadcast transaction: ${error.message}`);
            }
        }
    }
}
exports.handleUTXOWithdrawal = handleUTXOWithdrawal;
async function createAndBroadcastTransaction(utxos, wallet, transaction, amountToSend, flatFee, currentFeeRatePerByte, dustThreshold, chain, network, toAddress) {
    const psbt = new bitcoin.Psbt({ network });
    let totalInputValue = 0;
    const keyPairs = [];
    // Gather inputs until we have enough to cover the amount plus fees
    for (const utxo of utxos) {
        const walletData = (await db_1.models.walletData.findOne({
            where: { walletId: utxo.walletId },
        }));
        if (!walletData)
            continue;
        const decryptedData = JSON.parse((0, encrypt_1.decrypt)(walletData.data));
        if (!decryptedData.privateKey)
            continue;
        const rawTxHex = await (0, exports.fetchRawUtxoTransaction)(utxo.transactionId, chain);
        psbt.addInput({
            hash: utxo.transactionId,
            index: utxo.index,
            nonWitnessUtxo: Buffer.from(rawTxHex, "hex"),
        });
        totalInputValue += utxo.amount;
        const keyPair = ECPair.fromWIF(decryptedData.privateKey, network);
        keyPairs.push({ index: psbt.inputCount - 1, keyPair });
        // Estimate transaction size
        const numInputs = psbt.inputCount;
        const numOutputs = 2; // Assume two outputs: recipient and change
        const estimatedTxSize = numInputs * 180 + numOutputs * 34 + 10;
        // Calculate transaction fee
        let transactionFee = Math.ceil(estimatedTxSize * currentFeeRatePerByte);
        // Calculate required amount
        let requiredAmount = amountToSend + flatFee + transactionFee;
        let change = totalInputValue - requiredAmount;
        // Check if change is dust
        const isChangeDust = change > 0 && change < dustThreshold;
        if (isChangeDust) {
            transactionFee += change;
            requiredAmount += change;
            change = 0;
        }
        // Recalculate after adjustments
        requiredAmount = amountToSend + flatFee + transactionFee;
        change = totalInputValue - requiredAmount;
        if (totalInputValue >= requiredAmount) {
            // We have enough inputs
            // Build transaction outputs
            const outputs = [];
            // Recipient output
            outputs.push({
                address: toAddress,
                value: amountToSend,
            });
            // Change output if applicable
            if (change > 0) {
                outputs.push({
                    address: getChangeAddress(wallet, chain),
                    value: change,
                });
            }
            // Add outputs to PSBT
            outputs.forEach((output) => {
                psbt.addOutput(output);
            });
            // Sign inputs
            keyPairs.forEach(({ index, keyPair }) => {
                psbt.signInput(index, keyPair);
            });
            psbt.finalizeAllInputs();
            const rawTx = psbt.extractTransaction().toHex();
            const broadcastResult = await (0, exports.broadcastRawUtxoTransaction)(rawTx, chain);
            if (!broadcastResult.success) {
                throw new Error(`Failed to broadcast transaction: ${broadcastResult.error}`);
            }
            if (broadcastResult.success) {
                const txid = broadcastResult.txid;
                try {
                    // Handle change output and mark used UTXOs
                    if (change > 0) {
                        await recordChangeUtxo(txid, change, wallet, chain);
                    }
                    await markUsedUtxos(psbt, utxos);
                    return { success: true, txid };
                }
                catch (postBroadcastError) {
                    // Log the error but return success
                    (0, logger_1.logError)("post_broadcast_error", postBroadcastError, __filename);
                    return { success: true, txid };
                }
            }
            else {
                throw new Error(`Failed to broadcast transaction: ${broadcastResult.error}`);
            }
        }
    }
    throw new Error("Insufficient funds to cover the amount and transaction fee");
}
function getChangeAddress(wallet, chain) {
    var _a;
    const walletAddresses = typeof wallet.address === "string"
        ? JSON.parse(wallet.address)
        : wallet.address;
    if (!walletAddresses)
        throw new Error("Wallet addresses not found");
    if (!(walletAddresses === null || walletAddresses === void 0 ? void 0 : walletAddresses[chain]))
        throw new Error("Wallet address chain not found");
    if (!((_a = walletAddresses === null || walletAddresses === void 0 ? void 0 : walletAddresses[chain]) === null || _a === void 0 ? void 0 : _a.address))
        throw new Error("Wallet address not found");
    return walletAddresses[chain].address;
}
async function markUsedUtxos(psbt, utxos) {
    if (!psbt || !utxos) {
        console.error("Cannot mark used UTXOs: psbt or utxos is undefined");
        return;
    }
    for (let i = 0; i < psbt.inputCount; i++) {
        const input = psbt.txInputs[i];
        if (!input || !input.hash || input.index === undefined) {
            console.error(`Input at index ${i} is undefined or missing properties`);
            continue;
        }
        const txid = Buffer.from(input.hash).reverse().toString("hex");
        const index = input.index;
        // Find the UTXO in the list
        const utxo = utxos.find((u) => u.transactionId === txid && u.index === index);
        if (utxo) {
            await db_1.models.ecosystemUtxo.update({ status: true }, {
                where: { id: utxo.id },
            });
        }
        else {
            console.error(`UTXO not found for transaction ${txid} index ${index}`);
        }
    }
}
async function recordChangeUtxo(txid, changeAmount, wallet, chain) {
    if (!txid) {
        console.error("Cannot record change UTXO: txid is undefined");
        return;
    }
    const changeTxData = await (0, exports.fetchUtxoTransaction)(txid, chain);
    if (!changeTxData || !changeTxData.outputs) {
        console.error("Change transaction data is undefined or invalid");
        return;
    }
    const changeAddress = getChangeAddress(wallet, chain);
    const changeOutput = changeTxData.outputs.find((output) => output.addresses && output.addresses.includes(changeAddress));
    if (changeOutput) {
        const changeOutputIndex = changeTxData.outputs.indexOf(changeOutput);
        const changeScript = changeOutput.script;
        await db_1.models.ecosystemUtxo.create({
            walletId: wallet.id,
            transactionId: txid,
            index: changeOutputIndex,
            amount: changeAmount,
            script: changeScript,
            status: false,
        });
    }
    else {
        console.error("Change output not found in transaction data");
    }
}
async function markSpentUtxosFromError(error, chain, walletId) {
    // Extract the transaction ID and input index from the error message
    const spentUtxos = parseSpentUtxosFromError(error.message);
    if (spentUtxos.length === 0) {
        // Fallback: Check each UTXO individually
        await markSpentUtxos(chain, walletId);
    }
    else {
        // Mark the specific UTXOs as spent
        for (const spentUtxo of spentUtxos) {
            const utxo = await db_1.models.ecosystemUtxo.findOne({
                where: {
                    transactionId: spentUtxo.transactionId,
                },
            });
            if (utxo) {
                await db_1.models.ecosystemUtxo.update({ status: true }, {
                    where: { id: utxo.id },
                });
                console.log(`Marked UTXO as spent: transactionId=${spentUtxo.transactionId}, index=${spentUtxo.index}`);
            }
            else {
                console.error(`UTXO not found in database for transaction ${spentUtxo.transactionId} index ${spentUtxo.index}`);
            }
        }
    }
}
function parseSpentUtxosFromError(errorMessage) {
    const spentUtxos = [];
    const regex = /Transaction ([a-f0-9]{64}) referenced by input (\d+) of [a-f0-9]{64} has already been spent/gi;
    let match;
    while ((match = regex.exec(errorMessage)) !== null) {
        const transactionId = match[1];
        const index = parseInt(match[2]);
        spentUtxos.push({ transactionId, index });
    }
    return spentUtxos;
}
async function markSpentUtxos(chain, walletId) {
    // Fetch all unspent UTXOs for this wallet
    const utxos = await db_1.models.ecosystemUtxo.findAll({
        where: {
            status: false,
            walletId: walletId,
        },
    });
    // Check each UTXO individually
    for (const utxo of utxos) {
        try {
            const txData = await (0, exports.fetchUtxoTransaction)(utxo.transactionId, chain);
            // Check if the UTXO is spent
            const output = txData.outputs[utxo.index];
            const isSpent = output.spent || output.spender;
            if (isSpent) {
                await db_1.models.ecosystemUtxo.update({ status: true }, {
                    where: { id: utxo.id },
                });
            }
        }
        catch (error) {
            // If unable to fetch transaction data, log the error
            (0, logger_1.logError)("mark_spent_utxos", error, __filename);
        }
    }
}
