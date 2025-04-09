"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainId = exports.chainConfigs = exports.delay = exports.getTimestampInSeconds = void 0;
const sol_1 = __importDefault(require("../../blockchains/sol"));
const transactions_1 = require("./transactions");
const utxo_1 = require("./utxo");
function getTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
}
exports.getTimestampInSeconds = getTimestampInSeconds;
async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.delay = delay;
exports.chainConfigs = {
    ETH: {
        name: "Ethereum",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("ETH", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "api.etherscan.io",
            },
            sepolia: {
                explorer: "api-sepolia.etherscan.io",
            },
        },
        currency: "ETH",
        smartContract: {
            file: "ERC20",
            name: "ERC20",
        },
    },
    BSC: {
        name: "Binance Smart Chain",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("BSC", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "api.bscscan.com",
            },
            testnet: {
                explorer: "api-testnet.bscscan.com",
            },
        },
        currency: "BNB",
        smartContract: {
            file: "ERC20",
            name: "BEP20",
        },
    },
    POLYGON: {
        name: "Polygon",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("POLYGON", address),
        cache: true,
        networks: {
            matic: {
                explorer: "api.polygonscan.com",
            },
            "matic-mumbai": {
                explorer: "api-testnet.polygonscan.com",
            },
        },
        currency: "MATIC",
        smartContract: {
            file: "ERC20",
            name: "ERC20",
        },
    },
    FTM: {
        name: "Fantom",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("FTM", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "api.ftmscan.com",
            },
            testnet: {
                explorer: "api-testnet.ftmscan.com",
            },
        },
        currency: "FTM",
        smartContract: {
            file: "ERC20",
            name: "ERC20",
        },
    },
    OPTIMISM: {
        name: "Optimism",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("OPTIMISM", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "api-optimistic.etherscan.io",
            },
            goerli: {
                explorer: "api-goerli-optimistic.etherscan.io",
            },
        },
        currency: "ETH",
        smartContract: {
            file: "ERC20",
            name: "ERC20",
        },
    },
    ARBITRUM: {
        name: "Arbitrum",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("ARBITRUM", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "api.arbiscan.io",
            },
            goerli: {
                explorer: "api-goerli.arbiscan.io",
            },
        },
        currency: "ETH",
        smartContract: {
            file: "ERC20",
            name: "ERC20",
        },
    },
    BASE: {
        name: "Base",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("BASE", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "api.basescan.org",
            },
            goerli: {
                explorer: "api-goerli.basescan.org",
            },
        },
        currency: "ETH",
        smartContract: {
            file: "ERC20",
            name: "ERC20",
        },
    },
    CELO: {
        name: "Celo",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("CELO", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "api.celoscan.io",
            },
            alfajores: {
                explorer: "api-alfajores.celoscan.io",
            },
        },
        currency: "CELO",
        smartContract: {
            file: "ERC20",
            name: "ERC20",
        },
    },
    // MO (EVM)
    MO: {
        name: "MOCHAIN",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("MO", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "mainnet.mochain.app",
            },
            testnet: {
                explorer: "testnet.mochain.app",
            },
        },
        explorerApi: false,
        currency: "MO",
        smartContract: {
            file: "ERC20",
            name: "ERC20",
        },
    },
    TRON: {
        name: "Tron",
        decimals: 6,
        fetchFunction: (address) => (0, transactions_1.fetchPublicEcosystemTransactions)(`https://api.trongrid.io/v1/accounts/${address}/transactions?only_to=true&only_confirmed=true&limit=50&order_by=block_timestamp,asc`),
        cache: false,
        networks: {
            mainnet: {
                explorer: "api.trongrid.io",
            },
            shasta: {
                explorer: "api.shasta.trongrid.io",
            },
            nile: {
                explorer: "api.nileex.io",
            },
        },
        currency: "TRX",
    },
    RSK: {
        name: "RSK",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchPublicEcosystemTransactions)(`https://rootstock.blockscout.com/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from`),
        cache: true,
        networks: {
            mainnet: {
                explorer: "rootstock.blockscout.com/api/v2",
            },
        },
        currency: "RBTC",
    },
    HECO: {
        name: "Huobi ECO Chain",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchPublicEcosystemTransactions)(`https://api.hecoinfo.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`),
        cache: false,
        networks: {
            mainnet: {
                explorer: "api.hecoinfo.com",
            },
        },
        currency: "HT",
        smartContract: {
            file: "ERC20",
            name: "HRC20",
        },
    },
    CRONOS: {
        name: "Cronos",
        decimals: 18,
        fetchFunction: (address) => (0, transactions_1.fetchGeneralEcosystemTransactions)("CRONOS", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "api.cronoscan.com",
            },
        },
        currency: "CRON",
        smartContract: {
            file: "ERC20",
            name: "CRC20",
        },
    },
    BTC: {
        name: "Bitcoin",
        decimals: 8,
        fetchFunction: (address) => (0, utxo_1.fetchUTXOTransactions)("BTC", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "blockchain.info",
            },
        },
        currency: "BTC",
    },
    LTC: {
        name: "Litecoin",
        decimals: 8,
        fetchFunction: (address) => (0, utxo_1.fetchUTXOTransactions)("LTC", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "chain.so",
            },
        },
        currency: "LTC",
    },
    DOGE: {
        name: "Dogecoin",
        decimals: 8,
        fetchFunction: (address) => (0, utxo_1.fetchUTXOTransactions)("DOGE", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "chain.so",
            },
        },
        currency: "DOGE",
    },
    DASH: {
        name: "Dash",
        decimals: 8,
        fetchFunction: (address) => (0, utxo_1.fetchUTXOTransactions)("DASH", address),
        cache: true,
        networks: {
            mainnet: {
                explorer: "chain.so",
            },
        },
        currency: "DASH",
    },
    SOL: {
        name: "Solana",
        decimals: 9,
        fetchFunction: async (address) => {
            const solanaService = await sol_1.default.getInstance();
            return await solanaService.fetchTransactions(address);
        },
        cache: true,
        networks: {
            mainnet: {
                explorer: "https://explorer.solana.com",
            },
            testnet: {
                explorer: "https://explorer.solana.com?cluster=testnet",
            },
            devnet: {
                explorer: "https://explorer.solana.com?cluster=devnet",
            },
        },
        currency: "SOL",
        smartContract: {
            name: "SPL",
        },
    },
    XMR: {
        name: "Monero",
        decimals: 12,
        fetchFunction: async (address) => {
            throw new Error("Monero not supported yet");
        },
        cache: false,
        networks: {
            mainnet: {
                explorer: "https://xmrchain.net",
            },
        },
        currency: "XMR",
    },
    TON: {
        name: "TON",
        decimals: 9,
        fetchFunction: async (address) => {
            throw new Error("TON not supported yet");
        },
        cache: false,
        networks: {
            mainnet: {
                explorer: "https://tonscan.io",
            },
        },
        currency: "TON",
    },
};
// Get chain ID
const getChainId = async (provider) => {
    return (await provider.getNetwork()).chainId;
};
exports.getChainId = getChainId;
