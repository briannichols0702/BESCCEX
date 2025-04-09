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
const AnalyticsChart_1 = require("@/components/charts/AnalyticsChart");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const dashboard_1 = require("@/stores/dashboard");
const sonner_1 = require("sonner");
const TransactionsAnalytics = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (router.isReady &&
            getSetting("walletRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to access wallet analytics"));
        }
    }, [router.isReady, (_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status]);
    const { walletType, currency } = router.query;
    const [path, setPath] = (0, react_1.useState)();
    const [filters, setFilters] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        if (walletType && currency) {
            const newPath = `/user/wallet/${walletType}/${currency}`;
            setFilters({
                status: [
                    {
                        value: "PENDING",
                        label: "Pending",
                        color: "warning",
                        icon: "ph:circle",
                        path: `${newPath}?status=PENDING`,
                    },
                    {
                        value: "COMPLETED",
                        label: "Completed",
                        color: "success",
                        icon: "ph:check-circle",
                        path: `${newPath}?status=COMPLETED`,
                    },
                    {
                        value: "FAILED",
                        label: "Failed",
                        color: "danger",
                        icon: "ph:x-circle",
                        path: `${newPath}?status=FAILED`,
                    },
                    {
                        value: "CANCELLED",
                        label: "Cancelled",
                        color: "danger",
                        icon: "ph:x-circle",
                        path: `${newPath}?status=CANCELLED`,
                    },
                    {
                        value: "EXPIRED",
                        label: "Expired",
                        color: "primary",
                        icon: "ph:minus-circle",
                        path: `${newPath}?status=EXPIRED`,
                    },
                    {
                        value: "REJECTED",
                        label: "Rejected",
                        color: "danger",
                        icon: "ph:x-circle",
                        path: `${newPath}?status=REJECTED`,
                    },
                    {
                        value: "REFUNDED",
                        label: "Refunded",
                        color: "warning",
                        icon: "ph:circle",
                        path: `${newPath}?status=REFUNDED`,
                    },
                    {
                        value: "TIMEOUT",
                        label: "Timeout",
                        color: "danger",
                        icon: "ph:x-circle",
                        path: `${newPath}?status=TIMEOUT`,
                    },
                ],
            });
            setPath(newPath);
        }
    }, [walletType, currency, router.isReady]);
    return (<Default_1.default color="muted" title={t("Transactions Analytics")}>
      {path && (<AnalyticsChart_1.AnalyticsChart model="transaction" postTitle={t("Wallet Analysis")} modelName={`${currency} ${walletType}`} cardName={t("Transactions")} availableFilters={filters} color="primary" params={{ walletType, currency }} path="/api/finance/transaction/analysis"/>)}
    </Default_1.default>);
};
exports.default = TransactionsAnalytics;
