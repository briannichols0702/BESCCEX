"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WagmiProviderWrapper = void 0;
const react_1 = __importDefault(require("react"));
const react_query_1 = require("@tanstack/react-query");
const wagmi_1 = require("wagmi");
const chains_1 = require("wagmi/chains");
const wagmi_2 = require("wagmi");
const connectors_1 = require("wagmi/connectors");
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const chains = [chains_1.mainnet, chains_1.arbitrum, chains_1.polygon, chains_1.bsc, chains_1.fantom, chains_1.avalanche];
let config;
if (projectId) {
    config = (0, wagmi_1.createConfig)({
        connectors: [(0, connectors_1.walletConnect)({ projectId })],
        chains: chains,
        transports: chains.reduce((acc, chain) => {
            acc[chain.id] = (0, wagmi_1.http)();
            return acc;
        }, {}),
        ssr: true,
        storage: (0, wagmi_2.createStorage)({
            storage: wagmi_2.cookieStorage,
        }),
    });
}
else {
    console.warn("Project ID is not defined. Skipping wallet connect setup.");
    config = null;
}
const queryClient = new react_query_1.QueryClient();
const WagmiProviderWrapper = ({ children }) => {
    // Ensure the WagmiProvider only wraps children if config exists
    if (!config) {
        console.error("WagmiProvider config is not available. Please check projectId.");
        return <>{children}</>; // or display an error UI here
    }
    return (<wagmi_1.WagmiProvider config={config}>
      <react_query_1.QueryClientProvider client={queryClient}>{children}</react_query_1.QueryClientProvider>
    </wagmi_1.WagmiProvider>);
};
exports.WagmiProviderWrapper = WagmiProviderWrapper;
exports.default = exports.WagmiProviderWrapper;
