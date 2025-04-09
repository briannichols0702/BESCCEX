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
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const StripeSession = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const { sessionId } = router.query;
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [paymentStatus, setPaymentStatus] = (0, react_1.useState)(null);
    const [lineItems, setLineItems] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (!sessionId || !profile)
            return;
        const verifyPayment = async () => {
            try {
                const { data, error } = await (0, api_1.default)({
                    url: `/api/finance/deposit/fiat/stripe/verify`,
                    method: "POST",
                    silent: true,
                    params: { sessionId },
                });
                if (error)
                    sonner_1.toast.error(error);
                setPaymentStatus(data.status);
                setLineItems(data.line_items.map((item) => ({
                    id: item.id,
                    description: item.description,
                    currency: item.currency.toUpperCase(),
                    amount: item.amount,
                })));
            }
            catch (error) {
                console.error(error);
                setPaymentStatus("failed");
            }
            finally {
                setIsLoading(false);
            }
        };
        if (sessionId) {
            verifyPayment();
        }
    }, [sessionId, profile]);
    const total = lineItems.reduce((acc, item) => acc + item.amount, 0);
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
      <div>
        {paymentStatus === "succeeded" ? (<div className="my-auto text-center flex flex-col justify-center space-y-5 text-muted-800 dark:text-muted-200 py-20">
            {/* Placeholder for success animation */}
            <h1 className="text-2xl font-bold text-success-500">
              {t("Payment Successful")}
            </h1>
            <p>
              {t("Your payment has been processed successfully. Here are the details")}
            </p>
            {/* Example card component displaying payment details */}
            <div className="overflow-hidden font-sans">
              <div className="border-muted-200 dark:border-muted-700 flex flex-col justify-between gap-y-8 border-b p-8 sm:flex-row sm:items-center">
                <h3 className="text-md font-medium">
                  {t("Order")}{" "}
                  {sessionId}
                </h3>
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
                  <tbody className="divide-y bg-white dark:bg-muted-900  divide-muted-200 dark:divide-muted-700">
                    {lineItems.map((item, index) => (<tr key={index}>
                        <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                          {item.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {item.amount}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
            <p>
              {t("Congratulations! You have successfully deposited")}{" "}
              {total} {(_a = lineItems[0]) === null || _a === void 0 ? void 0 : _a.currency}{" "}
              {t("to your wallet.")}
            </p>
            <Button_1.default onClick={() => router.push("/user/wallet/FIAT")} color="primary">
              <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
          </div>) : (<div>
            {/* Placeholder for error icon */}
            <h1>{t("Payment Failed")}</h1>
            <p>
              {t("There was an issue processing your payment. Please try again later.")}
            </p>
          </div>)}
      </div>
    </Default_1.default>);
};
exports.default = StripeSession;
