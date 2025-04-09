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
const path = "/admin/finance/wallet";
const WalletsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        type: [
            {
                value: "FIAT",
                label: "Fiat",
                color: "success",
                icon: "ph:circle",
                path: `${path}?type=FIAT`,
            },
            {
                value: "SPOT",
                label: "Spot",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?type=SPOT`,
            },
            {
                value: "ECO",
                label: "Eco",
                color: "warning",
                icon: "ph:x-circle",
                path: `${path}?type=ECO`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Wallets Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="wallet" modelName={t("Wallets")} cardName={t("Wallets")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = WalletsAnalytics;
exports.permission = "Access Wallet Management";
