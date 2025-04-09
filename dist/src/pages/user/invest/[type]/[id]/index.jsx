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
const api_1 = __importDefault(require("@/utils/api"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const link_1 = __importDefault(require("next/link"));
const wallet_1 = require("@/stores/user/wallet");
const NewInvestment_1 = require("@/components/pages/user/invest/plan/NewInvestment");
const lottie_1 = require("@/components/elements/base/lottie");
const date_fns_1 = require("date-fns");
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const lodash_1 = require("lodash");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const next_i18next_1 = require("next-i18next");
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const sonner_1 = require("sonner");
const dashboard_1 = require("@/stores/dashboard");
const InvestmentPlansDashboard = () => {
    var _a, _b;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { settings } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const { type, id } = router.query;
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [plan, setPlan] = (0, react_1.useState)(null);
    const [investment, setInvestment] = (0, react_1.useState)(null);
    const { wallet, fetchWallet } = (0, wallet_1.useWalletStore)();
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [duration, setDuration] = (0, react_1.useState)({
        label: "Select Duration",
        value: "",
    });
    const fetchInvestmentPlan = async () => {
        if (!type || !id)
            return;
        let url;
        switch (type.toLowerCase()) {
            case "general":
                url = `/api/finance/investment/plan/${id}`;
                break;
            case "ai":
                url = `/api/ext/ai/investment/plan/${id}`;
                break;
            case "forex":
                url = `/api/ext/forex/investment/plan/${id}`;
                break;
            default:
                break;
        }
        const { data, error } = await (0, api_1.default)({
            url,
            silent: true,
        });
        if (!error) {
            setPlan(data);
        }
    };
    const fetchInvestment = async () => {
        if (!type || !id)
            return;
        let url;
        switch (type.toLowerCase()) {
            case "forex":
            case "general":
                url = `/api/finance/investment`;
                break;
            case "ai":
                url = `/api/ext/ai/investment`;
                break;
            default:
                break;
        }
        const { data, error } = await (0, api_1.default)({
            url,
            silent: true,
            params: { type },
        });
        if (error) {
            setInvestment(null);
        }
        else {
            setInvestment(data);
        }
    };
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchInvestmentPlan();
            fetchInvestment();
            setIsLoading(false);
        }
    }, [type, id, router.isReady]);
    (0, react_1.useEffect)(() => {
        if (plan) {
            fetchWallet(plan.walletType, plan.currency);
        }
    }, [plan]);
    const invest = async () => {
        if (!plan)
            return;
        if (!duration.value || isNaN(amount) || amount <= 0) {
            sonner_1.toast.error("Please select a duration and enter a valid amount to invest");
            return;
        }
        if (!wallet || wallet.balance < amount) {
            sonner_1.toast.error("Insufficient balance to invest");
            return;
        }
        if (amount < plan.minInvestment) {
            sonner_1.toast.error("Amount is less than the minimum investment");
            return;
        }
        if (amount > plan.maxInvestment) {
            sonner_1.toast.error("Amount is more than the maximum investment");
            return;
        }
        setIsLoading(true);
        const { error } = await (0, api_1.default)({
            url: `/api/finance/investment`,
            method: "POST",
            body: {
                type,
                planId: id,
                durationId: duration.value,
                amount,
            },
        });
        if (!error) {
            fetchInvestment();
            if (plan)
                fetchWallet(plan.walletType, plan.currency);
            setAmount(0);
            setDuration({ label: "Select Duration", value: "" });
        }
        setIsLoading(false);
    };
    const cancelInvestment = async () => {
        setIsLoading(true);
        const { error } = await (0, api_1.default)({
            url: `/api/finance/investment/${investment.id}`,
            method: "DELETE",
            params: { type },
        });
        if (!error) {
            setInvestment(null);
            if (plan)
                fetchWallet(plan.walletType, plan.currency);
        }
        setIsLoading(false);
    };
    const ROI = (0, react_1.useMemo)(() => {
        if (!plan || plan.profitPercentage === undefined)
            return 0;
        return ((amount * plan.profitPercentage) / 100).toFixed(8);
    }, [amount, plan]);
    const progress = (0, react_1.useMemo)(() => {
        if (!investment)
            return 0;
        const startDate = new Date(investment.createdAt).getTime();
        const endDate = new Date(investment.endDate).getTime();
        const currentDate = new Date().getTime();
        return ((currentDate - startDate) / (endDate - startDate)) * 100;
    }, [investment]);
    const statusColor = (0, react_1.useMemo)(() => {
        if (!investment)
            return "text-muted-400";
        switch (investment.status) {
            case "ACTIVE":
                return "primary";
            case "COMPLETED":
                return "success";
            case "CANCELLED":
            case "REJECTED":
                return "danger";
            default:
                return "muted";
        }
    }, [investment]);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            if (plan) {
                setInvestment((prev) => {
                    if (!prev)
                        return null;
                    if (prev.status === "ACTIVE") {
                        return {
                            ...prev,
                        };
                    }
                    return prev;
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [plan]);
    // Determine if investment Lottie is enabled
    const isInvestmentLottieEnabled = (settings === null || settings === void 0 ? void 0 : settings.lottieAnimationStatus) === "true" &&
        (settings === null || settings === void 0 ? void 0 : settings.investmentLottieEnabled) === "true";
    const investmentLottieFile = settings === null || settings === void 0 ? void 0 : settings.investmentLottieFile;
    return (<Default_1.default title={`${(plan === null || plan === void 0 ? void 0 : plan.title) || "Loading"} Investment Plan`} color="muted">
      <div className="mx-auto w-full max-w-xl mt-5">
        <div className="rounded-2xl border border-transparent md:border-muted-200 md:p-4 md:dark:border-muted-800 ">
          <Card_1.default color="contrast">
            <div className="flex items-center justify-between border-b border-muted-200 px-6 py-4 dark:border-muted-800">
              <div>
                <h2 className="font-sans text-base font-normal leading-tight text-muted-800 dark:text-muted-100">
                  {plan === null || plan === void 0 ? void 0 : plan.title}
                </h2>
                <p className="text-sm text-muted-400">{plan === null || plan === void 0 ? void 0 : plan.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <IconButton_1.default type="button" size="sm" color="muted" onClick={() => router.back()}>
                  <react_2.Icon icon="lucide:arrow-left" className="h-4 w-4"/>
                </IconButton_1.default>
              </div>
            </div>

            <div className="p-6 w-full flex flex-col gap-4">
              {plan && investment && investment.planId !== plan.id && (<Alert_1.default color="warning" canClose={false}>
                  <react_2.Icon icon="mdi:alert" className="h-6 w-6 text-warning-500"/>
                  <p className="text-sm text-warning-600">
                    You have an active investment in a different plan. You
                    cannot invest in this plan until your current investment is
                    completed.
                  </p>
                </Alert_1.default>)}

              <div className="rounded-lg bg-muted-100 p-4 dark:bg-muted-900">
                <div className="flex flex-col divide-y divide-muted-200 rounded-lg border border-muted-200 bg-white text-center dark:divide-muted-800 dark:border-muted-800 dark:bg-muted-950 md:flex-row md:divide-x md:divide-y-0">
                  <div className="my-2 flex-1 py-3">
                    <h3 className="mb-1 text-sm uppercase leading-tight text-muted-500 dark:text-muted-400 flex gap-1 justify-center items-center">
                      {t("Balance")}{" "}
                      <link_1.default href={`/user/wallet/deposit`}>
                        <react_2.Icon icon="mdi:plus" className="h-5 w-5 hover:text-primary-500 cursor-pointer"/>
                      </link_1.default>
                    </h3>
                    <span className="text-lg font-semibold text-muted-800 dark:text-muted-100">
                      {(wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0} {plan === null || plan === void 0 ? void 0 : plan.currency}
                    </span>
                  </div>
                  <div className="my-2 flex-1 py-3">
                    <h3 className="mb-1 text-sm uppercase leading-tight text-muted-500 dark:text-muted-400">
                      {investment ? "Invested" : "Investing"}
                    </h3>
                    <span className="text-lg font-semibold text-danger-500 ">
                      {investment ? investment.amount : amount} {plan === null || plan === void 0 ? void 0 : plan.currency}
                    </span>
                  </div>
                  <div className="my-2 flex-1 py-3">
                    <h3 className="mb-1 text-sm uppercase leading-tight text-muted-500 dark:text-muted-400">
                      {investment ? "Profit" : "ROI"}
                    </h3>
                    <span className="text-lg font-semibold text-success-500">
                      {investment ? investment.profit : ROI} {plan === null || plan === void 0 ? void 0 : plan.currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-transparent bg-muted-50 p-4 dark:bg-muted-900 md:border-muted-200 md:p-6 md:dark:border-muted-800">
                {investment ? (<div className="w-full">
                    {isInvestmentLottieEnabled ? (<lottie_1.Lottie category="stock-market" path="stock-market-monitoring" max={2} height={250}/>) : investmentLottieFile ? (<img src={investmentLottieFile} alt="Investment Illustration" className="mx-auto max-h-[250px] object-contain"/>) : null}
                    <div>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-semibold text-muted-800 dark:text-muted-100">
                          {(0, lodash_1.capitalize)(type)} {t("Investment Details")}
                        </p>
                        <Tag_1.default color={statusColor} shape={"rounded-sm"}>
                          {investment.status}
                        </Tag_1.default>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-400">
                            {t("Duration")}
                          </p>
                          <p className="text-sm text-muted-800 dark:text-muted-100">
                            {(_a = investment.duration) === null || _a === void 0 ? void 0 : _a.duration}{" "}
                            {(_b = investment.duration) === null || _b === void 0 ? void 0 : _b.timeframe}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-400">
                            {t("Amount")}
                          </p>
                          <p className="text-sm text-muted-800 dark:text-muted-100">
                            {investment.amount} {plan === null || plan === void 0 ? void 0 : plan.currency}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-400">
                            {t("Return of Investment")}
                          </p>
                          <p className="text-sm text-muted-800 dark:text-muted-100">
                            {investment.profit} {plan === null || plan === void 0 ? void 0 : plan.currency}
                          </p>
                        </div>
                        <div className="">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-400">
                              {t("Start Date")}
                            </p>
                            <p className="text-sm text-muted-400">
                              {t("End Date")}
                            </p>
                          </div>
                          <Progress_1.default size="sm" color="primary" value={progress} classNames={"my-[1px"}/>
                          <div className="flex justify-between items-center]">
                            <p className="text-sm text-muted-400">
                              {investment.createdAt &&
                (0, date_fns_1.formatDate)(new Date(investment.createdAt), "dd MMM yyyy, hh:mm a")}
                            </p>
                            <p className="text-sm text-muted-400">
                              {investment.endDate &&
                (0, date_fns_1.formatDate)(new Date(investment.endDate), "dd MMM yyyy, hh:mm a")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4 w-full justify-center border-t border-muted-200 dark:border-muted-800 pt-4">
                      <span className="w-1/2">
                        <Button_1.default type="button" color="danger" onClick={() => cancelInvestment()} loading={isLoading} disabled={investment.status !== "ACTIVE" || isLoading} className="w-full">
                          {t("Cancel Investment")}
                        </Button_1.default>
                      </span>
                    </div>
                  </div>) : (<NewInvestment_1.NewInvestment plan={plan} duration={duration} setDuration={setDuration} amount={amount} setAmount={setAmount} invest={invest} isLoading={isLoading}/>)}
              </div>
            </div>
          </Card_1.default>
        </div>
      </div>
    </Default_1.default>);
};
exports.default = InvestmentPlansDashboard;
