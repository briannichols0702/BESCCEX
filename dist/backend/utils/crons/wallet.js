"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPendingWithdrawals = exports.getPendingSpotTransactionsQuery = exports.processSpotPendingDeposits = exports.cleanupOldPnlRecords = exports.processWalletPnl = void 0;
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const db_1 = require("@b/db");
const logger_1 = require("../logger");
const sequelize_1 = require("sequelize");
const matchingEngine_1 = require("../eco/matchingEngine");
const date_fns_1 = require("date-fns");
const index_ws_1 = require("@b/api/finance/deposit/spot/index.ws");
const utils_1 = require("@b/api/finance/utils");
const notifications_1 = require("../notifications");
const walletTask_1 = require("./walletTask");
const utils_2 = require("@b/api/finance/deposit/spot/utils");
async function processWalletPnl() {
    try {
        const users = await db_1.models.user.findAll({ attributes: ["id"] });
        // Process users by adding tasks to the wallet PnL queue
        for (const user of users) {
            walletTask_1.walletPnlTaskQueue.add(() => handlePnl(user));
        }
    }
    catch (error) {
        (0, logger_1.logError)("processWalletPnl", error, __filename);
        throw error;
    }
}
exports.processWalletPnl = processWalletPnl;
const handlePnl = async (user) => {
    var _a;
    try {
        const wallets = await db_1.models.wallet.findAll({
            where: { userId: user.id },
            attributes: ["currency", "balance", "type"], // Fetch only necessary fields
        });
        if (!wallets.length)
            return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const uniqueCurrencies = Array.from(new Set(wallets.map((w) => w.currency)));
        const [todayPnl, currencyPrices, exchangePrices, engine] = await Promise.all([
            db_1.models.walletPnl.findOne({
                where: {
                    userId: user.id,
                    createdAt: {
                        [sequelize_1.Op.gte]: today,
                    },
                },
                attributes: ["id", "balances"], // Fetch only necessary fields
            }),
            db_1.models.currency.findAll({
                where: { id: uniqueCurrencies },
                attributes: ["id", "price"], // Fetch only necessary fields
            }),
            db_1.models.exchangeCurrency.findAll({
                where: { currency: uniqueCurrencies },
                attributes: ["currency", "price"], // Fetch only necessary fields
            }),
            matchingEngine_1.MatchingEngine.getInstance(), // Await this separately
        ]);
        const tickers = await engine.getTickers(); // Await the call to getTickers after getting the instance
        const currencyMap = new Map(currencyPrices.map((item) => [item.id, item.price]));
        const exchangeMap = new Map(exchangePrices.map((item) => [item.currency, item.price]));
        const balances = { FIAT: 0, SPOT: 0, ECO: 0 };
        for (const wallet of wallets) {
            let price;
            if (wallet.type === "FIAT") {
                price = currencyMap.get(wallet.currency);
            }
            else if (wallet.type === "SPOT") {
                price = exchangeMap.get(wallet.currency);
            }
            else if (wallet.type === "ECO") {
                price = ((_a = tickers[wallet.currency]) === null || _a === void 0 ? void 0 : _a.last) || 0;
            }
            if (price) {
                balances[wallet.type] += price * wallet.balance;
            }
        }
        if (Object.values(balances).some((balance) => balance > 0)) {
            if (todayPnl) {
                await todayPnl.update({ balances });
            }
            else {
                await db_1.models.walletPnl.create({
                    userId: user.id,
                    balances,
                    createdAt: today,
                });
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)(`handlePnl`, error, __filename);
        throw error;
    }
};
async function cleanupOldPnlRecords() {
    try {
        const oneMonthAgo = (0, date_fns_1.subDays)(new Date(), 30);
        const yesterday = (0, date_fns_1.subDays)(new Date(), 1);
        const zeroBalanceString = '{"FIAT":0,"SPOT":0,"ECO":0}';
        const zeroBalanceObject = { FIAT: 0, SPOT: 0, ECO: 0 };
        await db_1.models.walletPnl.destroy({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: oneMonthAgo,
                },
            },
        });
        await db_1.models.walletPnl.destroy({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: yesterday,
                },
                [sequelize_1.Op.or]: [
                    { balances: zeroBalanceString },
                    { balances: zeroBalanceObject },
                ],
            },
        });
    }
    catch (error) {
        (0, logger_1.logError)("cleanupOldPnlRecords", error, __filename);
    }
}
exports.cleanupOldPnlRecords = cleanupOldPnlRecords;
async function processSpotPendingDeposits() {
    try {
        const transactions = await getPendingSpotTransactionsQuery("DEPOSIT");
        for (const transaction of transactions) {
            const transactionId = transaction.id;
            const userId = transaction.userId;
            const trx = transaction.referenceId;
            if (!trx) {
                continue;
            }
            // Only start a new verification schedule if it's not already running
            if (!index_ws_1.spotVerificationIntervals.has(transactionId)) {
                (0, index_ws_1.startSpotVerificationSchedule)(transactionId, userId, trx);
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("processSpotPendingDeposits", error, __filename);
        throw error;
    }
}
exports.processSpotPendingDeposits = processSpotPendingDeposits;
async function getPendingSpotTransactionsQuery(type) {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return await db_1.models.transaction.findAll({
            where: {
                status: "PENDING",
                type,
                createdAt: {
                    [sequelize_1.Op.between]: [oneHourAgo, new Date()],
                },
                [sequelize_1.Op.and]: [
                    {
                        referenceId: { [sequelize_1.Op.ne]: null }, // Not equal to null
                    },
                    {
                        referenceId: { [sequelize_1.Op.ne]: "" }, // Not equal to empty string
                    },
                ],
            },
            include: [
                {
                    model: db_1.models.wallet,
                    as: "wallet",
                    attributes: ["id", "currency"], // Specify the fields to include from the wallet model
                },
            ],
        });
    }
    catch (error) {
        (0, logger_1.logError)("getPendingSpotTransactionsQuery", error, __filename);
        throw error;
    }
}
exports.getPendingSpotTransactionsQuery = getPendingSpotTransactionsQuery;
async function processPendingWithdrawals() {
    var _a, _b, _c;
    try {
        const transactions = (await getPendingSpotTransactionsQuery("WITHDRAW"));
        for (const transaction of transactions) {
            const userId = transaction.userId;
            const trx = transaction.referenceId;
            if (!trx)
                continue;
            const exchange = await exchange_1.default.startExchange();
            const provider = await exchange_1.default.getProvider();
            // Prepare the params for fetchWithdrawals
            const params = {};
            // If there's chain metadata and we're on XT, pass chain in params
            if (provider === "xt" && transaction.metadata) {
                try {
                    const { metadata, xtChain } = (0, utils_2.parseMetadataAndMapChainToXt)(transaction.metadata);
                    if (xtChain) {
                        params.network = xtChain;
                    }
                }
                catch (err) {
                    // handle JSON parse error if needed
                    console.error(`Metadata parse error for transaction ${transaction.id}:`, err);
                }
            }
            try {
                const withdrawals = await exchange.fetchWithdrawals((_a = transaction.wallet) === null || _a === void 0 ? void 0 : _a.currency, undefined, // since
                undefined, // limit
                params);
                const withdrawData = withdrawals.find((w) => w.id === trx);
                let withdrawStatus = "PENDING";
                if (withdrawData) {
                    switch (withdrawData.status) {
                        case "ok":
                            withdrawStatus = "COMPLETED";
                            break;
                        case "canceled":
                            withdrawStatus = "CANCELLED";
                            break;
                        case "failed":
                            withdrawStatus = "FAILED";
                    }
                }
                if (!withdrawStatus) {
                    continue;
                }
                if (transaction.status === withdrawStatus) {
                    continue;
                }
                await (0, utils_1.updateTransaction)(transaction.id, { status: withdrawStatus });
                if (withdrawStatus === "FAILED" || withdrawStatus === "CANCELLED") {
                    await (0, index_ws_1.updateSpotWalletBalance)(userId, (_b = transaction.wallet) === null || _b === void 0 ? void 0 : _b.currency, Number(transaction.amount), Number(transaction.fee), "REFUND_WITHDRAWAL");
                    await (0, notifications_1.handleNotification)({
                        userId,
                        title: "Withdrawal Failed",
                        message: `Your withdrawal of ${transaction.amount} ${(_c = transaction.wallet) === null || _c === void 0 ? void 0 : _c.currency} has failed.`,
                        type: "ACTIVITY",
                    });
                }
            }
            catch (error) {
                (0, logger_1.logError)(`processPendingWithdrawals - transaction ${transaction.id}`, error, __filename);
                continue;
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("processPendingWithdrawals", error, __filename);
        throw error;
    }
}
exports.processPendingWithdrawals = processPendingWithdrawals;
