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
const dashboard_1 = require("@/stores/dashboard");
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const next_i18next_1 = require("next-i18next");
const PaymentSuccessPage = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { orderId } = router.query;
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [paymentStatus, setPaymentStatus] = (0, react_1.useState)("");
    const [currencyCode, setCurrencyCode] = (0, react_1.useState)("");
    const [depositAmount, setDepositAmount] = (0, react_1.useState)(0);
    const [taxAmount, setTaxAmount] = (0, react_1.useState)(0);
    const [totalAmount, setTotalAmount] = (0, react_1.useState)(0);
    const [payerName, setPayerName] = (0, react_1.useState)(`${profile === null || profile === void 0 ? void 0 : profile.firstName} ${profile === null || profile === void 0 ? void 0 : profile.lastName}`);
    const [payerEmail, setPayerEmail] = (0, react_1.useState)((profile === null || profile === void 0 ? void 0 : profile.email) || "");
    (0, react_1.useEffect)(() => {
        const fetchPaymentDetails = async () => {
            var _a, _b, _c;
            if (!orderId)
                return;
            try {
                const { data, error } = await (0, api_1.default)({
                    url: `/api/finance/deposit/fiat/paypal/details`,
                    method: "POST",
                    silent: true,
                    params: { orderId },
                });
                if (error) {
                    sonner_1.toast.error(error);
                    setPaymentStatus("failed");
                    setIsLoading(false);
                    return;
                }
                setPaymentStatus(data.status);
                const purchaseUnit = data.purchase_units[0];
                setCurrencyCode(purchaseUnit.amount.currency_code);
                setDepositAmount(parseFloat(purchaseUnit.amount.breakdown.item_total.value));
                setTaxAmount(parseFloat(purchaseUnit.amount.breakdown.tax_total.value));
                setTotalAmount(parseFloat(purchaseUnit.amount.value));
                setPayerName(((_b = (_a = data.payer) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.given_name) || "");
                setPayerEmail(((_c = data.payer) === null || _c === void 0 ? void 0 : _c.email_address) || "");
            }
            catch (error) {
                console.error(error);
                setPaymentStatus("failed");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPaymentDetails();
    }, [orderId, profile]);
    const formatPrice = (amount, currency) => {
        // Dummy formatting function, replace with your actual formatting logic
        return `${amount.toFixed(2)} ${currency}`;
    };
    if (isLoading) {
        return (<Default_1.default title={t("Processing...")} color="muted">
        <div className="my-auto text-center flex flex-col justify-center space-y-5 py-20 items-center text-muted-800 dark:text-muted-200">
          <react_2.Icon icon="mdi:loading" className="animate-spin text-4xl text-primary-500 h-24 w-24"/>
          <h1 className="text-2xl font-bold">{t("Processing Payment...")}</h1>
          <p>{t("Please wait while we process your payment.")}</p>
        </div>
      </Default_1.default>);
    }
    return (<Default_1.default title={t("Deposit Success")} color="muted">
      {paymentStatus === "COMPLETED" ? (<div className="my-auto text-center flex flex-col justify-center space-y-5 text-muted-800 dark:text-muted-200 py-20">
          <h1 className="text-2xl font-bold text-success-500">
            {t("Payment Successful")}
          </h1>
          <p>
            {t("Your payment has been processed successfully. Here are the details")}
          </p>
          <div className="overflow-hidden font-sans">
            <div className="border-muted-200 dark:border-muted-700 flex flex-col justify-between gap-y-8 border-b p-8 sm:flex-row sm:items-center">
              <h3 className="text-md font-medium">
                {t("Order")}{" "}
                {orderId}
              </h3>
              <p>
                {t("Payer")}{" "}
                {payerName} ({payerEmail})
              </p>
            </div>
            <div className="flex flex-col">
              <table className="min-w-full divide-y divide-muted-200 dark:divide-muted-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      {t("Description")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      {t("Currency")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                      {t("Amount")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white dark:bg-muted-900 divide-muted-200 dark:divide-muted-700">
                  <tr>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium">
                      {t("Deposit to")}
                      {currencyCode}
                      {t("Wallet")}
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                      {currencyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {formatPrice(depositAmount, currencyCode)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium">
                      {t("Tax")}
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                      {currencyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {formatPrice(taxAmount, currencyCode)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium">
                      {t("Total")}
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                      {currencyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {formatPrice(totalAmount, currencyCode)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p>
            {t("Congratulations! You have successfully deposited")}{" "}
            {formatPrice(depositAmount, currencyCode)}{" "}
            {t("to your")}{" "}
            {currencyCode} {t("Wallet.")}
          </p>
          <Button_1.default onClick={() => router.push("/user/wallet/FIAT")} color="primary">
            <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
            {t("Go Back")}
          </Button_1.default>
        </div>) : (<div>
          <h1>{t("Payment Failed")}</h1>
          <p>
            {t("There was an issue processing your payment. Please try again later.")}
          </p>
        </div>)}
    </Default_1.default>);
};
exports.default = PaymentSuccessPage;
