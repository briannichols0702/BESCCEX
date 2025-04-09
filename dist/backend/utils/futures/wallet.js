"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWalletByCurrency = void 0;
const logger_1 = require("../logger");
const db_1 = require("@b/db");
async function getUserWalletByCurrency(userId, currency) {
    try {
        const wallet = await db_1.models.wallet.findOne({
            where: {
                userId,
                currency,
                type: "FUTURES",
            },
        });
        if (!wallet) {
            throw new Error(`Wallet not found for user ${userId} and currency ${currency}`);
        }
        return wallet;
    }
    catch (error) {
        (0, logger_1.logError)("get_user_wallet", error, __filename);
        throw error;
    }
}
exports.getUserWalletByCurrency = getUserWalletByCurrency;
