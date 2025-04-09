"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onClose = exports.metadata = void 0;
// index.ws.ts
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const tokens_1 = require("@b/utils/eco/tokens");
const EVMDeposits_1 = require("./util/monitor/EVMDeposits");
const UTXODeposits_1 = require("./util/monitor/UTXODeposits");
const SolanaDeposits_1 = require("./util/monitor/SolanaDeposits");
const TronDeposits_1 = require("./util/monitor/TronDeposits");
const MoneroDeposits_1 = require("./util/monitor/MoneroDeposits");
const TonDeposits_1 = require("./util/monitor/TonDeposits");
const MODeposits_1 = require("./util/monitor/MODeposits");
const cron_1 = require("@b/utils/cron");
const PendingVerification_1 = require("./util/PendingVerification");
const worker_threads_1 = require("worker_threads");
const monitorInstances = new Map(); // Maps userId -> monitor instance
const monitorStopTimeouts = new Map(); // Maps userId -> stopPolling timeout ID
let workerInitialized = false;
exports.metadata = {};
exports.default = async (data, message) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    if (typeof message === "string") {
        try {
            message = JSON.parse(message);
        }
        catch (err) {
            console.error(`Failed to parse incoming message: ${err.message}`);
            throw (0, error_1.createError)(400, "Invalid JSON payload");
        }
    }
    const { currency, chain, address } = message.payload;
    const wallet = await db_1.models.wallet.findOne({
        where: {
            userId: user.id,
            currency,
            type: "ECO",
        },
    });
    if (!wallet)
        throw (0, error_1.createError)(400, "Wallet not found");
    if (!wallet.address)
        throw (0, error_1.createError)(400, "Wallet address not found");
    const addresses = await JSON.parse(wallet.address);
    const walletChain = addresses[chain];
    if (!walletChain)
        throw (0, error_1.createError)(400, "Address not found");
    const token = await (0, tokens_1.getEcosystemToken)(chain, currency);
    if (!token)
        throw (0, error_1.createError)(400, "Token not found");
    const contractType = token.contractType;
    const finalAddress = contractType === "NO_PERMIT" ? address : walletChain.address;
    const monitorKey = user.id;
    // Clear any pending stop timeouts since the user reconnected
    if (monitorStopTimeouts.has(monitorKey)) {
        clearTimeout(monitorStopTimeouts.get(monitorKey));
        monitorStopTimeouts.delete(monitorKey);
    }
    let monitor = monitorInstances.get(monitorKey);
    // If a monitor exists but is inactive (stopped), remove it and recreate
    if (monitor && monitor.active === false) {
        console.log(`Monitor for user ${monitorKey} is inactive. Creating a new monitor.`);
        monitorInstances.delete(monitorKey);
        monitor = null;
    }
    if (!monitor) {
        // No existing monitor for this user, create a new one
        monitor = createMonitor(chain, {
            wallet,
            chain,
            currency,
            address: finalAddress,
            contractType,
        });
        await monitor.watchDeposits();
        monitorInstances.set(monitorKey, monitor);
    }
    else {
        // Monitor already exists, just reuse it
        console.log(`Reusing existing monitor for user ${monitorKey}`);
    }
    if (worker_threads_1.isMainThread && !workerInitialized) {
        await (0, cron_1.createWorker)("verifyPendingTransactions", PendingVerification_1.verifyPendingTransactions, 10000);
        console.log("Verification worker started");
        workerInitialized = true;
    }
};
function createMonitor(chain, options) {
    const { wallet, currency, address, contractType } = options;
    if (["BTC", "LTC", "DOGE", "DASH"].includes(chain)) {
        return new UTXODeposits_1.UTXODeposits({ wallet, chain, address });
    }
    else if (chain === "SOL") {
        return new SolanaDeposits_1.SolanaDeposits({ wallet, chain, currency, address });
    }
    else if (chain === "TRON") {
        return new TronDeposits_1.TronDeposits({ wallet, chain, address });
    }
    else if (chain === "XMR") {
        return new MoneroDeposits_1.MoneroDeposits({ wallet });
    }
    else if (chain === "TON") {
        return new TonDeposits_1.TonDeposits({ wallet, chain, address });
    }
    else if (chain === "MO" && contractType !== "NATIVE") {
        return new MODeposits_1.MODeposits({ wallet, chain, currency, address, contractType });
    }
    else {
        return new EVMDeposits_1.EVMDeposits({ wallet, chain, currency, address, contractType });
    }
}
const onClose = async (ws, route, clientId) => {
    // Clear any previous pending stop timeouts for this client
    if (monitorStopTimeouts.has(clientId)) {
        clearTimeout(monitorStopTimeouts.get(clientId));
        monitorStopTimeouts.delete(clientId);
    }
    const monitor = monitorInstances.get(clientId);
    if (monitor && typeof monitor.stopPolling === "function") {
        // Schedule stopPolling after 10 minutes if the user doesn't reconnect
        const timeoutId = setTimeout(() => {
            monitor.stopPolling();
            monitorStopTimeouts.delete(clientId);
            monitorInstances.delete(clientId);
        }, 10 * 60 * 1000); // 10 minutes
        monitorStopTimeouts.set(clientId, timeoutId);
    }
};
exports.onClose = onClose;
