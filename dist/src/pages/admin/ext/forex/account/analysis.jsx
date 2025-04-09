"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
// pages/chart.tsx
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const AnalyticsChart_1 = require("@/components/charts/AnalyticsChart");
const next_i18next_1 = require("next-i18next");
const path = "/admin/ext/forex/account";
const ForexAccountsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        type: [
            {
                value: "LIVE",
                label: "Live",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?type=true`,
            },
            {
                value: "DEMO",
                label: "Demo",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?type=false`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Forex Accounts Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="forexAccount" modelName={t("Forex Accounts")} cardName={t("Accounts")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = ForexAccountsAnalytics;
exports.permission = "Access Forex Account Management";
