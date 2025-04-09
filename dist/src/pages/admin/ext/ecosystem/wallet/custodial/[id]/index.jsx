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
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const api_1 = __importDefault(require("@/utils/api"));
const object_table_1 = require("@/components/elements/base/object-table");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const next_i18next_1 = require("next-i18next");
const ViewCustodialWallet = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [wallet, setWallet] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [nativeTransferModalOpen, setNativeTransferModalOpen] = (0, react_1.useState)(false);
    const [tokenTransferModalOpen, setTokenTransferModalOpen] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({
        recipient: "",
        amount: "",
        tokenAddress: "",
    });
    (0, react_1.useEffect)(() => {
        if (id) {
            fetchCustodialWallet(id);
        }
    }, [id]);
    const fetchCustodialWallet = async (walletId) => {
        setLoading(true);
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/ext/ecosystem/wallet/custodial/${walletId}`,
            silent: true,
        });
        if (!error) {
            setWallet(data);
        }
        setLoading(false);
    };
    const handleTransfer = async (type) => {
        const url = `/api/admin/ext/ecosystem/wallet/custodial/${id}/transfer/${type}`;
        const payload = type === "native"
            ? { recipient: formData.recipient, amount: formData.amount }
            : {
                recipient: formData.recipient,
                amount: formData.amount,
                tokenAddress: formData.tokenAddress,
            };
        const { error } = await (0, api_1.default)({
            url,
            method: "POST",
            body: payload,
        });
        if (!error) {
            fetchCustodialWallet(id);
        }
        // Close the modal after the transfer
        if (type === "native") {
            setNativeTransferModalOpen(false);
        }
        else {
            setTokenTransferModalOpen(false);
        }
    };
    const columns = [
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
            field: "tokenAddress",
            label: "Token Address",
            type: "text",
            sortable: false,
        },
        { field: "balance", label: "Balance", type: "text", sortable: false },
    ];
    if (!wallet) {
        return null;
    }
    return (<Default_1.default title={t("Custodial Wallet")} color="muted">
      <main className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="font-sans text-2xl font-light leading-[1.125] text-muted-800 dark:text-muted-100">
              {t("Custodial Wallet")}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button_1.default type="button" color={"primary"} onClick={() => setNativeTransferModalOpen(true)}>
              {t("Transfer Native Tokens")}
            </Button_1.default>
            <Button_1.default type="button" color={"primary"} onClick={() => setTokenTransferModalOpen(true)}>
              {t("Transfer ERC-20 Tokens")}
            </Button_1.default>
            <BackButton_1.BackButton href="/admin/ext/ecosystem/wallet/custodial"/>
          </div>
        </div>

        <object_table_1.ObjectTable items={wallet.tokenBalances} columnConfig={columns}/>
        <Modal_1.default open={nativeTransferModalOpen} size="sm">
          <Card_1.default shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Transfer Native Tokens")}
              </p>
              <IconButton_1.default size="md" shape="full" onClick={() => setNativeTransferModalOpen(false)}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:px-6 md:pb-8">
              <form onSubmit={(e) => {
            e.preventDefault();
            handleTransfer("native");
        }}>
                <Input_1.default label={t("Recipient Address")} placeholder={t("Recipient Address")} value={formData.recipient} onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} required/>
                <Input_1.default label={t("Amount")} placeholder={t("Amount")} value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required/>
                <div className="flex w-full justify-end gap-2 mt-4">
                  <Button_1.default type="submit" variant="solid" color="primary" shape="smooth" loading={loading} disabled={loading}>
                    {t("Transfer")}
                  </Button_1.default>
                </div>
              </form>
            </div>
          </Card_1.default>
        </Modal_1.default>
        <Modal_1.default open={tokenTransferModalOpen} size="sm">
          <Card_1.default shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Transfer ERC-20 Tokens")}
              </p>
              <IconButton_1.default size="md" shape="full" onClick={() => setTokenTransferModalOpen(false)}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:px-6 md:pb-8">
              <form onSubmit={(e) => {
            e.preventDefault();
            handleTransfer("token");
        }}>
                <Input_1.default label={t("Recipient Address")} placeholder={t("Recipient Address")} value={formData.recipient} onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} required/>
                <Input_1.default label={t("Amount")} placeholder={t("Amount")} value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required/>
                <Input_1.default label={t("Token Address")} placeholder={t("Token Address")} value={formData.tokenAddress} onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })} required/>
                <div className="flex w-full justify-end gap-2 mt-4">
                  <Button_1.default type="submit" variant="solid" color="primary" shape="smooth" loading={loading} disabled={loading}>
                    {t("Transfer")}
                  </Button_1.default>
                </div>
              </form>
            </div>
          </Card_1.default>
        </Modal_1.default>
      </main>
    </Default_1.default>);
};
exports.default = ViewCustodialWallet;
exports.permission = "Access Ecosystem Custodial Wallet Management";
