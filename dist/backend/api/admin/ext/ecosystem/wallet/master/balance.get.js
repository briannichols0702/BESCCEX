"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterWalletBalancesController = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const utils_1 = require("./utils");
const redis_1 = require("@b/utils/redis");
const date_fns_1 = require("date-fns");
const utxo_1 = require("@b/utils/eco/utxo");
const provider_1 = require("@b/utils/eco/provider");
const chains_1 = require("@b/utils/eco/chains");
const ethers_1 = require("ethers");
exports.metadata = {
    summary: "Updates and retrieves balances for all master wallets",
    description: "Performs a balance update for all master wallets and retrieves the updated information.",
    operationId: "updateMasterWalletBalances",
    tags: ["Admin", "Ecosystem", "Wallets", "Balance Update"],
    responses: {
        200: {
            description: "Master wallets updated and retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                walletId: { type: "string", description: "Wallet identifier" },
                                currency: {
                                    type: "string",
                                    description: "Currency of the wallet",
                                },
                                balance: {
                                    type: "number",
                                    description: "Current balance of the wallet",
                                },
                                updatedAt: {
                                    type: "string",
                                    format: "date-time",
                                    description: "Last updated timestamp of the wallet balance",
                                },
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, user must be authenticated and have appropriate permissions",
        },
        500: {
            description: "Failed to update or retrieve wallet balances",
        },
    },
    permission: "Access Ecosystem Master Wallet Management",
};
const getMasterWalletBalancesController = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    try {
        const wallets = await (0, utils_1.getAllMasterWallets)();
        await Promise.all(wallets.map((wallet) => getWalletBalance(wallet)));
        return wallets;
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to fetch master wallets: ${error.message}`,
        });
    }
};
exports.getMasterWalletBalancesController = getMasterWalletBalancesController;
const getWalletBalance = async (wallet) => {
    try {
        const cacheKey = `wallet:${wallet.id}:balance`;
        const redis = redis_1.RedisSingleton.getInstance();
        let cachedBalanceData = await redis.get(cacheKey);
        if (cachedBalanceData) {
            if (typeof cachedBalanceData !== "object") {
                cachedBalanceData = JSON.parse(cachedBalanceData);
            }
            const now = new Date();
            const lastUpdated = new Date(cachedBalanceData.timestamp);
            if ((0, date_fns_1.differenceInMinutes)(now, lastUpdated) < 5 &&
                parseFloat(cachedBalanceData.balance) !== 0) {
                return;
            }
        }
        let formattedBalance;
        if (["BTC", "LTC", "DOGE", "DASH"].includes(wallet.chain)) {
            formattedBalance = await (0, utxo_1.fetchUTXOWalletBalance)(wallet.chain, wallet.address);
        }
        else {
            const provider = await (0, provider_1.getProvider)(wallet.chain);
            const balance = await provider.getBalance(wallet.address);
            const decimals = chains_1.chainConfigs[wallet.chain].decimals;
            formattedBalance = ethers_1.ethers.formatUnits(balance.toString(), decimals);
        }
        if (!formattedBalance || isNaN(parseFloat(formattedBalance))) {
            console.error(`Invalid formatted balance for ${wallet.chain} wallet: ${formattedBalance}`);
            return;
        }
        if (parseFloat(formattedBalance) === 0) {
            return;
        }
        await (0, utils_1.updateMasterWalletBalance)(wallet.id, parseFloat(formattedBalance));
        const cacheData = {
            balance: formattedBalance,
            timestamp: new Date().toISOString(),
        };
        await redis.setex(cacheKey, 300, JSON.stringify(cacheData));
    }
    catch (error) {
        console.error(`Failed to fetch ${wallet.chain} wallet balance: ${error.message}`);
    }
};
