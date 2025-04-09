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
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const ActionItem_1 = __importDefault(require("@/components/elements/base/dropdown-action/ActionItem"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const datatable_2 = require("@/stores/datatable");
const wallet_1 = require("@/stores/user/wallet");
const next_i18next_1 = require("next-i18next");
const link_1 = __importDefault(require("next/link"));
const api = "/api/ext/p2p/offer/manage";
const columnConfig = [
    {
        field: "paymentMethod.name",
        label: "Method",
        sublabel: "paymentMethod.currency",
        type: "text",
        sortable: true,
        sortName: "paymentMethod.name",
        getValue: (item) => { var _a; return (_a = item.paymentMethod) === null || _a === void 0 ? void 0 : _a.name; },
        getSubValue: (item) => { var _a; return (_a = item.paymentMethod) === null || _a === void 0 ? void 0 : _a.currency; },
        path: "/admin/ext/p2p/payment/method?name=[paymentMethod.name]",
        hasImage: true,
        imageKey: "paymentMethod.image",
        placeholder: "/img/placeholder.svg",
    },
    {
        field: "currency",
        label: "Currency",
        sublabel: "walletType",
        type: "text",
        sortable: true,
        getValue: (item) => `${item.currency} ${item.chain ? `(${item.chain})` : ""}`,
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "inOrder",
        label: "In Order",
        type: "number",
        sortable: true,
    },
    {
        field: "price",
        label: "Price",
        type: "number",
        sortable: true,
    },
    {
        field: "p2pReviews",
        label: "Rating",
        type: "rating",
        getValue: (data) => {
            if (!data.p2pReviews.length)
                return 0;
            const rating = data.p2pReviews.reduce((acc, review) => acc + review.rating, 0);
            return rating / data.p2pReviews.length;
        },
        sortable: true,
        sortName: "p2pReviews.rating",
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
        ],
    },
];
const P2pOffers = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { fetchData } = (0, datatable_2.useDataTable)();
    const { wallet, fetchWallet } = (0, wallet_1.useWalletStore)();
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isDepositingOpen, setIsDepositingOpen] = (0, react_1.useState)(false);
    const [isWithdrawingOpen, setIsWithdrawingOpen] = (0, react_1.useState)(false);
    const [selectedOffer, setSelectedOffer] = (0, react_1.useState)(null);
    const handleDeposit = async () => {
        if (!amount || amount <= 0)
            return sonner_1.toast.error("Please enter a valid amount to deposit");
        if (!selectedOffer)
            return sonner_1.toast.error("Please select an offer to deposit");
        setIsLoading(true);
        const { error } = await (0, api_1.default)({
            url: `/api/ext/p2p/offer/manage/${selectedOffer.id}/deposit`,
            method: "POST",
            body: {
                amount,
            },
        });
        if (!error) {
            fetchData();
        }
        setIsLoading(false);
    };
    const handleWithdraw = async () => {
        if (!amount || amount <= 0)
            return sonner_1.toast.error("Please enter a valid amount to withdraw");
        if (!selectedOffer)
            return sonner_1.toast.error("Please select an offer to withdraw");
        setIsLoading(true);
        const { error } = await (0, api_1.default)({
            url: `/api/ext/p2p/offer/manage/${selectedOffer.id}/withdraw`,
            method: "POST",
            body: {
                amount,
            },
        });
        if (!error) {
            fetchData();
        }
        setIsLoading(false);
    };
    return (<Default_1.default title={t("P2P Offers")} color="muted">
      <datatable_1.DataTable title={t("P2P Offers")} endpoint={api} columnConfig={columnConfig} canDelete={false} hasAnalytics viewPath="/p2p/offer/[id]" canCreate={false} isParanoid={false} dropdownActionsSlot={(item) => (<>
            <ActionItem_1.default key="deposit" icon="mdi:wallet-plus" text="Deposit" subtext="Deposit funds" onClick={async () => {
                await fetchWallet(item.walletType, item.currency);
                setSelectedOffer(item);
                setIsDepositingOpen(true);
            }}/>
            <ActionItem_1.default key="withdraw" icon="mdi:credit-card-minus" text="Withdraw" subtext="Withdraw funds" onClick={async () => {
                await fetchWallet(item.walletType, item.currency);
                setSelectedOffer(item);
                setIsWithdrawingOpen(true);
            }}/>
          </>)} navSlot={<>
            <link_1.default href="/user/p2p/offer" color="success">
              <IconButton_1.default variant="pastel" aria-label="Create Offer" color="success" size="lg">
                <react_2.Icon icon={"mdi-plus"} className="h-6 w-6"/>
              </IconButton_1.default>
            </link_1.default>
          </>}/>

      <Modal_1.default open={isDepositingOpen} size="sm">
        {selectedOffer && (<Card_1.default shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Deposit Funds")}
              </p>

              <IconButton_1.default size="sm" shape="full" onClick={() => {
                setIsDepositingOpen(false);
                setAmount(0);
            }}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
                {t("Deposit funds to the offer, the amount will be transferred from wallet to the offer and change the status to ACTIVE")}
              </p>
              <Input_1.default type="number" // Ensure the input type is number
         shape="curved" placeholder={t("Enter the amount to deposit")} label={t("Amount")} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} // Allow decimal values
         min={selectedOffer.minAmount} max={wallet ? wallet.balance : selectedOffer.maxAmount} step="0.01" // Allow decimal values
         error={amount > ((wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0)
                ? "Amount is more than the wallet balance"
                : ""}/>

              {/* wallet balance */}
              <Card_1.default className="mt-6 p-3">
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Wallet Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance : 0} {selectedOffer.currency}
                  </span>
                </div>
                {/* wallet remaining balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Remaining Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance - amount : 0}{" "}
                    {selectedOffer.currency}
                  </span>
                </div>
                {/* new offer balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("New Offer Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {selectedOffer.amount + amount} {selectedOffer.currency}
                  </span>
                </div>
              </Card_1.default>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button_1.default color="success" type="button" onClick={async () => {
                await handleDeposit();
                setIsDepositingOpen(false);
                setAmount(0);
            }} disabled={(wallet ? amount > (wallet === null || wallet === void 0 ? void 0 : wallet.balance) : false) ||
                amount === 0 ||
                isLoading} loading={isLoading}>
                  {t("Deposit")}
                </Button_1.default>
              </div>
            </div>
          </Card_1.default>)}
      </Modal_1.default>

      <Modal_1.default open={isWithdrawingOpen} size="sm">
        {selectedOffer && (<Card_1.default shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Withdraw Funds")}
              </p>

              <IconButton_1.default size="sm" shape="full" onClick={() => {
                setIsWithdrawingOpen(false);
                setAmount(0);
            }}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
                {t("Withdraw funds from the offer, the amount will be transferred from the offer to wallet and change the status to ACTIVE")}
              </p>
              <Input_1.default type="number" // Ensure the input type is number
         shape="curved" placeholder={t("Enter the amount to withdraw")} label={t("Amount")} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} // Allow decimal values
         min={selectedOffer.minAmount} max={selectedOffer.amount} step="0.01" // Allow decimal values
         error={amount > selectedOffer.amount
                ? "Amount is more than the offer amount"
                : ""}/>
              <Card_1.default className="mt-6 p-3">
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Wallet Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance : 0} {selectedOffer.currency}
                  </span>
                </div>
                {/* wallet remaining balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Remaining Wallet Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance + amount : 0}{" "}
                    {selectedOffer.currency}
                  </span>
                </div>
                {/* remaining offer balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Remaining Offer Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {selectedOffer.amount - amount} {selectedOffer.currency}
                  </span>
                </div>
              </Card_1.default>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button_1.default color="success" type="button" onClick={async () => {
                await handleWithdraw();
                setIsWithdrawingOpen(false);
                setAmount(0);
            }} disabled={amount > selectedOffer.amount || amount === 0 || isLoading} loading={isLoading}>
                  {t("Withdraw")}
                </Button_1.default>
              </div>
            </div>
          </Card_1.default>)}
      </Modal_1.default>
    </Default_1.default>);
};
exports.default = P2pOffers;
