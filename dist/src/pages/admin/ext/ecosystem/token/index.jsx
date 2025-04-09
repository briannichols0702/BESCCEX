"use client";
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
exports.permission = void 0;
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const ActionItem_1 = __importDefault(require("@/components/elements/base/dropdown-action/ActionItem"));
const sonner_1 = require("sonner");
const next_i18next_1 = require("next-i18next");
const useWagmi_1 = __importDefault(require("@/context/useWagmi"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const WalletConnectButton = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/user/profile/WalletConnectButton"))), { ssr: false } // Prevents it from being server-side rendered
);
const api = "/api/admin/ext/ecosystem/token";
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const columnConfig = [
    {
        field: "currency",
        label: "Currency",
        sublabel: "name",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "icon",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
    },
    {
        field: "chain",
        label: "Chain",
        type: "select",
        sortable: true,
        options: [
            { value: "ARBITRUM", label: "Arbitrum", color: "contrast" },
            { value: "BASE", label: "Basechain", color: "info" },
            { value: "BSC", label: "Binance Smart Chain", color: "info" },
            { value: "BTC", label: "Bitcoin", color: "warning" },
            { value: "CELO", label: "Celo", color: "success" },
            { value: "DASH", label: "Dash", color: "primary" },
            { value: "DOGE", label: "Dogecoin", color: "contrast" },
            { value: "ETH", label: "Ethereum", color: "primary" },
            { value: "FTM", label: "Fantom", color: "warning" },
            { value: "LTC", label: "Litecoin", color: "danger" },
            { value: "OPTIMISM", label: "Optimism", color: "danger" },
            { value: "POLYGON", label: "Polygon", color: "success" },
            { value: "SOL", label: "Solana", color: "success" },
            { value: "TRON", label: "Tron", color: "danger" },
            { value: "XMR", label: "Monero", color: "warning" },
            { value: "TON", label: "TON", color: "info" },
            { value: "MO", label: "Mo Chain", color: "info" },
        ],
    },
    {
        field: "network",
        label: "Network",
        type: "text",
        sortable: true,
    },
    {
        field: "contractType",
        label: "Type",
        type: "select",
        sortable: true,
        options: [
            { value: "PERMIT", label: "Permit", color: "success" },
            { value: "NO_PERMIT", label: "No Permit", color: "warning" },
            { value: "NATIVE", label: "Native", color: "info" },
        ],
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
        options: [
            { value: true, label: "Active", color: "success" },
            { value: false, label: "Inactive", color: "danger" },
        ],
    },
];
const Tokens = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const handleAddToMetamask = async (item) => {
        try {
            if (window.ethereum) {
                const wasAdded = await window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: item.contract,
                            symbol: item.symbol,
                            decimals: item.decimals,
                            image: item.image, // A string URL of the token logo
                        },
                    },
                });
                if (wasAdded) {
                    sonner_1.toast.success(`${item.name} added to Metamask`);
                }
                else {
                    sonner_1.toast.error("Failed to add token to Metamask");
                }
            }
            else {
                sonner_1.toast.error("Metamask not detected");
            }
        }
        catch (error) {
            console.error("An error occurred while adding the token to Metamask", error);
            sonner_1.toast.error((error === null || error === void 0 ? void 0 : error.message) || "An unexpected error occurred. Please try again.");
        }
    };
    return (<Default_1.default title={t("Ecosystem Tokens")} color="muted">
      <datatable_1.DataTable title={t("Tokens")} endpoint={api} columnConfig={columnConfig} canImport={true} dropdownActionsSlot={(item) => (<>
            {["BTC", "LTC", "DOGE", "DASH"].includes(item.currency) ? null : (<ActionItem_1.default key="addToMetamask" icon="logos:metamask-icon" text="Add to Metamask" subtext="Add Token to Metamask" onClick={() => handleAddToMetamask(item)}/>)}
          </>)} navSlot={<>
            {projectId && (<useWagmi_1.default>
                <WalletConnectButton />
              </useWagmi_1.default>)}
          </>}/>
    </Default_1.default>);
};
exports.default = Tokens;
exports.permission = "Access Ecosystem Token Management";
