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
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const wagmi_1 = require("wagmi");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const useLoginWallet_1 = require("@/hooks/useLoginWallet");
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner"); // Updated import for toast notifications
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";
const WalletLogin = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { setIsFetched } = (0, dashboard_1.useDashboardStore)();
    const { connectors, connect } = (0, wagmi_1.useConnect)();
    const { address, isConnected } = (0, wagmi_1.useAccount)();
    const { disconnect } = (0, wagmi_1.useDisconnect)();
    const [walletLoading, setWalletLoading] = (0, react_1.useState)(false);
    const { handleWalletLogin, signature, message } = (0, useLoginWallet_1.useLoginWallet)(); // Added message to destructuring
    const [chain, setChain] = (0, react_1.useState)(null);
    const chainId = (0, wagmi_1.useChainId)();
    (0, react_1.useEffect)(() => {
        if (chainId) {
            setChain(chainId);
        }
    }, [chainId]);
    (0, react_1.useEffect)(() => {
        const signInWithWallet = async () => {
            if (signature && address && chain && message) {
                // Check if message is available
                try {
                    const { data, error } = await (0, api_1.default)({
                        url: "/api/auth/login/wallet",
                        method: "POST",
                        body: { message, signature },
                    });
                    if (error || !data) {
                        throw new Error("Signature verification failed");
                    }
                    setIsFetched(false);
                    router.push(defaultUserPath);
                }
                catch (error) {
                    console.error(error);
                    sonner_1.toast.error("Failed to sign in with wallet.");
                }
            }
        };
        signInWithWallet();
    }, [signature, address, chain, message]); // Added message to dependencies
    // Filter out unique connectors based on name
    const uniqueConnectors = connectors.filter((connector, index, self) => (connector.name === "MetaMask" || connector.name === "WalletConnect") &&
        index === self.findIndex((c) => c.name === connector.name));
    const handleDisconnect = () => {
        setWalletLoading(true);
        disconnect();
        setWalletLoading(false);
    };
    return (<div className="flex gap-2 mb-5 w-full">
      {isConnected && address ? (<Tooltip_1.Tooltip content={t("Disconnect Wallet")}>
          <IconButton_1.default onClick={() => {
                handleDisconnect();
            }} variant="pastel" disabled={walletLoading} loading={walletLoading} color="danger">
            <react_2.Icon icon="hugeicons:wifi-disconnected-01" className="w-6 h-6"/>
          </IconButton_1.default>
        </Tooltip_1.Tooltip>) : (<div className="flex gap-2 w-full">
          {uniqueConnectors.map((connector) => (<div className="w-full" key={connector.id}>
              <Button_1.default onClick={() => {
                    setWalletLoading(true);
                    connect({ connector });
                    setWalletLoading(false);
                }} variant="pastel" className="w-full" disabled={walletLoading} loading={walletLoading} color="warning">
                <react_2.Icon icon={connector.name === "MetaMask"
                    ? "logos:metamask-icon"
                    : "simple-icons:walletconnect"} className="w-6 h-6 mr-2"/>
                {t("Connect")} {connector.name}
              </Button_1.default>
            </div>))}
        </div>)}
      {isConnected && address && (<div className="w-full">
          <Button_1.default onClick={() => handleWalletLogin(address, chain)} color="info" className="w-full" loading={walletLoading} disabled={walletLoading}>
            <react_2.Icon icon="simple-icons:walletconnect" className="w-4 h-4 mr-2"/>
            {t("Sign In With Wallet")}
          </Button_1.default>
        </div>)}
    </div>);
};
exports.default = WalletLogin;
