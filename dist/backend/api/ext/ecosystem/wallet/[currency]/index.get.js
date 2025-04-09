"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveCustodialWallets = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
const wallet_1 = require("@b/utils/eco/wallet");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Fetches a specific wallet by currency",
    description: "Retrieves details of a wallet associated with the logged-in user by its currency.",
    operationId: "getWallet",
    tags: ["Wallet", "User"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "currency",
            in: "path",
            required: true,
            schema: { type: "string", description: "Currency of the wallet" },
        },
        {
            name: "contractType",
            in: "query",
            schema: { type: "string", description: "Chain of the wallet address" },
        },
        {
            name: "chain",
            in: "query",
            schema: { type: "string", description: "Chain of the wallet address" },
        },
    ],
    responses: {
        200: {
            description: "Wallet retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseWalletSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Wallet"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params, user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { currency } = params;
    const { contractType, chain } = query;
    const wallet = await (0, wallet_1.getWalletByUserIdAndCurrency)(user.id, currency);
    if (contractType === "NO_PERMIT") {
        await (0, utils_1.unlockExpiredAddresses)();
        try {
            const wallets = await getActiveCustodialWallets(chain);
            const availableWallets = [];
            for (const wallet of wallets) {
                if (!(await (0, utils_1.isAddressLocked)(wallet.address))) {
                    availableWallets.push(wallet);
                }
            }
            if (availableWallets.length === 0) {
                throw (0, error_1.createError)({
                    statusCode: 404,
                    message: "All custodial wallets are currently in use. Please try again later.",
                });
            }
            const randomIndex = Math.floor(Math.random() * availableWallets.length);
            const selectedWallet = availableWallets[randomIndex];
            (0, utils_1.lockAddress)(selectedWallet.address);
            return selectedWallet;
        }
        catch (error) {
            throw (0, error_1.createError)({
                statusCode: 500,
                message: error.message,
            });
        }
    }
    return wallet;
};
async function getActiveCustodialWallets(chain) {
    return await db_1.models.ecosystemCustodialWallet.findAll({
        where: {
            chain: chain,
            status: "ACTIVE",
        },
        attributes: ["id", "address", "chain", "network"],
    });
}
exports.getActiveCustodialWallets = getActiveCustodialWallets;
