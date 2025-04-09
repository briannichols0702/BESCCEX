/* eslint-disable react/no-unescaped-entities */
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
const react_1 = __importStar(require("react"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const wallet_1 = require("@/stores/user/wallet"); // Import the wallet store
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const PurchaseModal = ({ isVisible, onClose, asset, chain, }) => {
    const { wallet, fetchWallet } = (0, wallet_1.useWalletStore)(); // Access wallet state and actions
    // Fetch wallet information based on the asset's wallet type and currency
    (0, react_1.useEffect)(() => {
        if (isVisible && !wallet) {
            fetchWallet("ECO", chain);
        }
    }, [isVisible, wallet, fetchWallet]);
    // Handle background blur effect when the modal is open
    (0, react_1.useEffect)(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isVisible]);
    if (!isVisible)
        return null;
    return (<div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-xs transition-all duration-300 ease-in-out">
      {/* Modal Container */}
      <div className="bg-white dark:bg-muted-800 rounded-xl p-8 w-[500px] shadow-2xl relative border border-gray-100 dark:border-muted-700 transition-all duration-300 ease-in-out">
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <IconButton_1.default onClick={onClose} color="muted">
            <react_2.Icon icon="mdi:close" className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition duration-300"/>
          </IconButton_1.default>
        </div>

        {/* Modal Content */}
        <h3 className="text-2xl font-bold text-center text-muted-900 dark:text-white mb-2">
          Pay with Crypto
        </h3>
        <p className="text-center text-sm text-muted-600 dark:text-muted-400 mb-6">
          Complete your purchase of <strong>{asset.name}</strong>.
        </p>

        {/* Payment Amount */}
        <div className="flex justify-center items-center mb-6">
          <IconBox_1.default variant="pastel" size="xl" shape="straight" color="primary" mask="hexed" icon="solar:wallet-bold-duotone"/>
        </div>

        <div className="text-center">
          <div className="text-sm text-muted-600 dark:text-muted-400 mb-2">
            Payment Amount
          </div>
          <div className="text-3xl font-bold text-muted-900 dark:text-white mb-2">
            {asset.price} {chain}
          </div>
        </div>

        <div className="text-center my-6 p-6 bg-muted-100 dark:bg-muted-900 rounded-lg">
          {/* Wallet Balance */}
          {wallet ? (<div className="text-sm font-medium text-muted-600 dark:text-muted-400">
              Wallet Balance: {wallet.balance} {wallet.currency}
            </div>) : (<div className="text-sm font-medium text-muted-600 dark:text-muted-400">
              Wallet Balance: 0 {chain}
            </div>)}

          {/* Warning Message */}
          {(wallet && wallet.balance < asset.price) ||
            (!wallet && (<p className="text-sm text-red-500 font-medium mt-2">
                You don't have enough crypto in your wallet.
              </p>))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6 gap-4">
          <div className="w-1/2">
            <Button_1.default onClick={onClose} className="w-full" color={"muted"}>
              Back
            </Button_1.default>
          </div>
          <div className="w-1/2">
            {wallet && wallet.balance >= asset.price ? (<Button_1.default disabled={!wallet || wallet.balance < asset.price} className="w-full" color={"primary"}>
                Buy Now
              </Button_1.default>) : (<ButtonLink_1.default className="w-full" color={"primary"} href="/user/wallet/deposit">
                Deposit Now
              </ButtonLink_1.default>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.default = PurchaseModal;
