"use strict";
// /api/admin/ecosystem/custodialWallets/view.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const provider_1 = require("@b/utils/eco/provider");
const smartContract_1 = require("@b/utils/eco/smartContract");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const ethers_1 = require("ethers");
exports.metadata = {
    summary: "View Ecosystem Custodial Wallet Balances and Tokens",
    operationId: "viewEcosystemCustodialWallet",
    tags: ["Admin", "Ecosystem Custodial Wallets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ecosystem custodial wallet",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    responses: {
        200: {
            description: "Ecosystem custodial wallet balances and tokens retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            nativeBalance: {
                                type: "string",
                                description: "Native token balance",
                            },
                            tokenBalances: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        tokenAddress: {
                                            type: "string",
                                            description: "Token contract address",
                                        },
                                        name: {
                                            type: "string",
                                            description: "Token name",
                                        },
                                        currency: {
                                            type: "string",
                                            description: "Token currency",
                                        },
                                        icon: {
                                            type: "string",
                                            description: "Token icon URL",
                                        },
                                        balance: {
                                            type: "string",
                                            description: "Token balance",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: (0, query_1.notFoundMetadataResponse)("Custodial Wallet"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecosystem Custodial Wallet Management",
};
exports.default = async (data) => {
    const { params } = data;
    const { id } = params;
    try {
        const custodialWallet = await db_1.models.ecosystemCustodialWallet.findByPk(id);
        if (!custodialWallet) {
            throw new Error(`Custodial wallet not found`);
        }
        const provider = await (0, provider_1.getProvider)(custodialWallet.chain);
        if (!provider) {
            throw new Error("Provider not initialized");
        }
        const { abi } = await (0, smartContract_1.getSmartContract)("wallet", "CustodialWalletERC20");
        if (!abi) {
            throw new Error("Smart contract ABI not found");
        }
        const contract = new ethers_1.ethers.Contract(custodialWallet.address, abi, provider);
        let nativeBalance;
        try {
            nativeBalance = await contract.getNativeBalance();
            if (nativeBalance === undefined) {
                nativeBalance = ethers_1.ethers.parseUnits("0", 18);
            }
        }
        catch (error) {
            console.error("Error fetching native balance:", error);
            nativeBalance = ethers_1.ethers.parseUnits("0", 18); // Default to zero if fetching fails
        }
        const tokens = await db_1.models.ecosystemToken.findAll({
            where: { chain: custodialWallet.chain, status: true },
            attributes: ["contract", "decimals", "name", "currency", "icon"],
        });
        const tokenAddresses = tokens.map((token) => token.contract);
        let tokenBalancesRaw;
        try {
            tokenBalancesRaw = await contract.getAllBalances(tokenAddresses);
            if (!tokenBalancesRaw || tokenBalancesRaw.length === 0) {
                tokenBalancesRaw = [
                    nativeBalance,
                    Array(tokenAddresses.length).fill(ethers_1.ethers.parseUnits("0", 18)),
                ];
            }
        }
        catch (callError) {
            console.error("Contract call error:", callError);
            tokenBalancesRaw = [
                nativeBalance,
                Array(tokenAddresses.length).fill(ethers_1.ethers.parseUnits("0", 18)),
            ]; // Default to zero balances if fetching fails
        }
        const tokenBalances = tokenBalancesRaw[1].map((balance, index) => ({
            tokenAddress: tokenAddresses[index],
            name: tokens[index].name,
            currency: tokens[index].currency,
            icon: tokens[index].icon,
            balance: ethers_1.ethers.formatUnits(balance, tokens[index].decimals),
        }));
        return {
            nativeBalance: ethers_1.ethers.formatEther(nativeBalance),
            tokenBalances,
        };
    }
    catch (error) {
        console.error(`Failed to retrieve custodial wallet balances and tokens: ${error.message}`);
        throw new Error(error.message);
    }
};
