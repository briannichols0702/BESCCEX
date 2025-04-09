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
const wagmi_1 = require("wagmi");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const api_1 = __importDefault(require("@/utils/api"));
const dashboard_1 = require("@/stores/dashboard");
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const WalletConnectButton = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { walletConnected, setWalletConnected } = (0, dashboard_1.useDashboardStore)();
    const { connectors, connect } = (0, wagmi_1.useConnect)();
    const { address, isConnected } = (0, wagmi_1.useAccount)();
    const { disconnect } = (0, wagmi_1.useDisconnect)();
    const [walletLoading, setWalletLoading] = (0, react_1.useState)(false);
    const chainId = (0, wagmi_1.useChainId)();
    const handleConnect = async (connector) => {
        setWalletLoading(true);
        connect({ connector });
        setWalletLoading(false);
    };
    const handleDisconnect = async () => {
        setWalletLoading(true);
        await (0, api_1.default)({
            url: "/api/user/profile/wallet/disconnect",
            method: "POST",
            body: { address },
        });
        disconnect();
        setWalletLoading(false);
        setWalletConnected(false);
    };
    const registerWalletAddress = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/user/profile/wallet/connect",
            method: "POST",
            body: { address, chainId },
        });
        if (!error) {
            setWalletConnected(true);
        }
    };
    const uniqueConnectors = connectors.filter((connector, index, self) => (connector.name === "MetaMask" || connector.name === "WalletConnect") &&
        index === self.findIndex((c) => c.name === connector.name));
    return (<div>
      {walletConnected && isConnected ? (<Button_1.default onClick={handleDisconnect} disabled={walletLoading} loading={walletLoading} color="danger" shape={"rounded-sm"}>
          <react_2.Icon icon="hugeicons:wifi-disconnected-01" className="w-6 h-6 mr-2"/>
          {t("Remove Wallet")}
        </Button_1.default>) : !walletConnected && isConnected ? (<Button_1.default onClick={registerWalletAddress} disabled={walletLoading} loading={walletLoading} color="success" shape={"rounded-sm"}>
          <react_2.Icon icon="hugeicons:wifi-connected-03" className="w-6 h-6 mr-2"/>
          {t("Register Wallet")}
        </Button_1.default>) : (<div className="flex gap-2">
          {uniqueConnectors.map((connector) => (<div className="w-full" key={connector.id}>
              <Button_1.default onClick={() => {
                    handleConnect(connector);
                }} variant="pastel" className="w-full" disabled={walletLoading} loading={walletLoading} color="warning" shape={"rounded-sm"}>
                <react_2.Icon icon={connector.name === "MetaMask"
                    ? "logos:metamask-icon"
                    : "simple-icons:walletconnect"} className="w-6 h-6 mr-2"/>
                {t("Connect")} {connector.name}
              </Button_1.default>
            </div>))}
        </div>)}
    </div>);
};
exports.default = WalletConnectButton;
