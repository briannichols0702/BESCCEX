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
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const api_1 = __importDefault(require("@/utils/api"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const next_i18next_1 = require("next-i18next");
const P2POfferEditor = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [formData, setFormData] = (0, react_1.useState)(null);
    const [paymentMethodId, setPaymentMethodId] = (0, react_1.useState)(null);
    const [walletType, setWalletType] = (0, react_1.useState)(null);
    const [chain, setChain] = (0, react_1.useState)(null);
    const [currency, setCurrency] = (0, react_1.useState)(null);
    const [price, setPrice] = (0, react_1.useState)("");
    const [minAmount, setMinAmount] = (0, react_1.useState)("");
    const [maxAmount, setMaxAmount] = (0, react_1.useState)("");
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchFormData();
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        if (formData && id) {
            fetchOfferData();
        }
    }, [formData, id]);
    (0, react_1.useEffect)(() => {
        if (walletType && formData) {
            // Preserve the currency if it matches the new walletType's currencies
            setCurrency((prevCurrency) => {
                const matchingCurrency = formData.currencies[walletType.value].find((cur) => cur.value === (prevCurrency === null || prevCurrency === void 0 ? void 0 : prevCurrency.value));
                return matchingCurrency || null;
            });
        }
    }, [walletType, formData]);
    (0, react_1.useEffect)(() => {
        if (currency && formData) {
            // Ensure that the chain is valid for the selected currency
            const validChains = formData.chains[currency.value] || [];
            if (!validChains.includes((chain === null || chain === void 0 ? void 0 : chain.value) || "")) {
                setChain(null); // Reset chain only if the current chain is not valid for the selected currency
            }
        }
    }, [currency, formData, chain]);
    const fetchFormData = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/ext/p2p/offer/manage/data",
            silent: true,
        });
        if (!error && data) {
            setFormData(data);
        }
    };
    const fetchOfferData = async () => {
        if (!id)
            return;
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/p2p/offer/${id}`,
            silent: true,
        });
        if (!error && data) {
            setPaymentMethodId((formData === null || formData === void 0 ? void 0 : formData.paymentMethods.find((method) => method.value === data.paymentMethodId)) || null);
            const walletOption = [
                { value: "FIAT", label: t("Fiat") },
                { value: "SPOT", label: t("Spot") },
                { value: "ECO", label: t("Funding") },
            ].find((type) => type.value === data.walletType) || null;
            setWalletType(walletOption);
            if (walletOption && formData) {
                const selectedCurrency = formData.currencies[walletOption.value].find((cur) => cur.value === data.currency) || null;
                setCurrency(selectedCurrency);
                if (selectedCurrency) {
                    const availableChains = formData.chains[selectedCurrency.value];
                    if (availableChains) {
                        const selectedChain = availableChains.find((chain) => chain === data.chain);
                        setChain(selectedChain
                            ? { value: selectedChain, label: selectedChain }
                            : null);
                    }
                    else {
                        setChain(null);
                    }
                }
            }
            setPrice(data.price ? data.price.toString() : "");
            setMinAmount(data.minAmount ? data.minAmount.toString() : "");
            setMaxAmount(data.maxAmount ? data.maxAmount.toString() : "");
        }
    };
    const handleSubmit = async () => {
        const body = {
            paymentMethodId: paymentMethodId === null || paymentMethodId === void 0 ? void 0 : paymentMethodId.value,
            walletType: walletType === null || walletType === void 0 ? void 0 : walletType.value,
            chain: chain === null || chain === void 0 ? void 0 : chain.value,
            currency: currency === null || currency === void 0 ? void 0 : currency.value,
            price: parseFloat(price),
            minAmount: parseFloat(minAmount),
            maxAmount: parseFloat(maxAmount),
        };
        const method = id ? "PUT" : "POST";
        const url = id
            ? `/api/ext/p2p/offer/manage/${id}`
            : `/api/ext/p2p/offer/manage`;
        const { error } = await (0, api_1.default)({
            url,
            method,
            body,
        });
        if (!error) {
            router.push(`/user/p2p`);
        }
    };
    const getCurrencyOptions = () => {
        if (!walletType || !formData)
            return [];
        return formData.currencies[walletType.value] || [];
    };
    const getChainOptions = () => {
        var _a;
        if (!currency || !formData || !formData.chains)
            return [];
        return (((_a = formData.chains[currency.value]) === null || _a === void 0 ? void 0 : _a.map((chain) => ({
            value: chain,
            label: chain,
        }))) || []);
    };
    if (!formData)
        return null;
    return (<Default_1.default title={t("P2P Offer Editor")} color="muted">
      <Card_1.default className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-lg mb-4 md:mb-0">
            {id ? t("Editing Offer") : t("New P2P Offer")}
          </h1>
          <div className="flex gap-2">
            <Button_1.default onClick={() => router.push(`/user/p2p`)} variant="outlined" shape="rounded-sm" size="md" color="danger">
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default onClick={handleSubmit} variant="outlined" shape="rounded-sm" size="md" color="success">
              {t("Save")}
            </Button_1.default>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex flex-col">
            <Listbox_1.default label={t("Payment Method")} options={formData.paymentMethods} selected={paymentMethodId} setSelected={setPaymentMethodId}/>
            <small className="text-warning-500 mt-1 text-xs">
              {t("Select the payment method you wish to use for this P2P offer.")}
            </small>
          </div>
          <div className="flex flex-col">
            <Listbox_1.default label={t("Wallet Type")} options={[
            { value: "FIAT", label: t("Fiat") },
            { value: "SPOT", label: t("Spot") },
            { value: "ECO", label: t("Funding") },
        ]} selected={walletType} setSelected={(selectedOption) => {
            setWalletType(selectedOption);
        }}/>
            <small className="text-warning-500 mt-1 text-xs">
              {t("Choose the wallet type for the transaction: Fiat, Spot, or Funding.")}
            </small>
          </div>
          <div className="flex flex-col">
            <Listbox_1.default label={t("Currency")} options={getCurrencyOptions()} selected={currency} setSelected={(selectedOption) => {
            setCurrency(selectedOption);
        }}/>
            <small className="text-warning-500 mt-1 text-xs">
              {t("Select the currency for this offer based on the chosen wallet type.")}
            </small>
          </div>
          {(walletType === null || walletType === void 0 ? void 0 : walletType.value) === "ECO" && (<div className="flex flex-col">
              <Listbox_1.default label={t("Chain")} options={getChainOptions()} selected={chain} setSelected={setChain}/>
              <small className="text-warning-500 mt-1 text-xs">
                {t("Specify the blockchain network if the wallet type is Funding.")}
              </small>
            </div>)}

          <div className="flex flex-col">
            <Input_1.default label={t("Price")} placeholder={t("Enter price per unit")} value={price} onChange={(e) => setPrice(e.target.value)}/>
            <small className="text-warning-500 mt-1 text-xs">
              {t("Enter the price per unit of the selected currency.")}
            </small>
          </div>
          <div className="flex flex-col">
            <Input_1.default label={t("Minimum Amount")} placeholder={t("Enter minimum transaction amount")} value={minAmount} onChange={(e) => setMinAmount(e.target.value)}/>
            <small className="text-warning-500 mt-1 text-xs">
              {t("Specify the minimum amount allowed for a transaction in this offer.")}
            </small>
          </div>
          <div className="flex flex-col">
            <Input_1.default label={t("Maximum Amount")} placeholder={t("Enter maximum transaction amount")} value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)}/>
            <small className="text-warning-500 mt-1 text-xs">
              {t("Specify the maximum amount allowed for a transaction in this offer.")}
            </small>
          </div>
        </div>
      </Card_1.default>
    </Default_1.default>);
};
exports.default = P2POfferEditor;
