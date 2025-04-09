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
// pages/chart.tsx
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const AnalyticsChart_1 = require("@/components/charts/AnalyticsChart");
const lodash_1 = require("lodash");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const path = "/api/finance/investment";
const analysisPath = "/api/finance/investment/analysis";
const InvestmentsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { type } = router.query;
    const [availableFilters, setAvailableFilters] = react_1.default.useState(null);
    (0, react_1.useEffect)(() => {
        if (router.isReady && type) {
            const filters = {
                status: [
                    {
                        value: "ACTIVE",
                        label: "active",
                        color: "primary",
                        icon: "ph:circle",
                        path: `${path}?status=ACTIVE`,
                    },
                    {
                        value: "COMPLETED",
                        label: "completed",
                        color: "success",
                        icon: "ph:check-circle",
                        path: `${path}?status=COMPLETED`,
                    },
                    {
                        value: "CANCELLED",
                        label: "cancelled",
                        color: "muted",
                        icon: "ph:stop-circle",
                        path: `${path}?status=CANCELLED`,
                    },
                    {
                        value: "REJECTED",
                        label: "rejected",
                        color: "danger",
                        icon: "ph:x-circle",
                        path: `${path}?status=REJECTED`,
                    },
                ],
            };
            setAvailableFilters(filters);
        }
    }, [router.isReady, type]);
    return (<Default_1.default color="muted" title={`${(0, lodash_1.capitalize)(type)} Investments Analytics`}>
      {availableFilters && (<AnalyticsChart_1.AnalyticsChart model={type === "general" ? "investment" : "forexInvestment"} modelName={`${(0, lodash_1.capitalize)(type)} Investments`} cardName={t("Investments")} availableFilters={availableFilters} color="primary" path={analysisPath} pathModel/>)}
    </Default_1.default>);
};
exports.default = InvestmentsAnalytics;
