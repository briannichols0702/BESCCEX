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
const path = "/admin/finance/order/exchange";
const ExchangeOrdersAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "OPEN",
                label: "Open",
                color: "warning",
                icon: "ph:circle",
                path: `${path}?status=OPEN`,
            },
            {
                value: "CLOSED",
                label: "Closed",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=CLOSED`,
            },
            {
                value: "CANCELED",
                label: "Canceled",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?status=CANCELED`,
            },
            {
                value: "EXPIRED",
                label: "Expired",
                color: "primary",
                icon: "ph:minus-circle",
                path: `${path}?status=EXPIRED`,
            },
            {
                value: "REJECTED",
                label: "Rejected",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?status=REJECTED`,
            },
        ],
        side: [
            {
                value: "BUY",
                label: "Buy",
                color: "success",
                icon: "ph:arrow-up",
                path: `${path}?side=BUY`,
            },
            {
                value: "SELL",
                label: "Sell",
                color: "danger",
                icon: "ph:arrow-down",
                path: `${path}?side=SELL`,
            },
        ],
        type: [
            {
                value: "MARKET",
                label: "Market",
                color: "primary",
                icon: "ph:arrows-left-right",
                path: `${path}?type=MARKET`,
            },
            {
                value: "LIMIT",
                label: "Limit",
                color: "primary",
                icon: "ph:arrows-left-right",
                path: `${path}?type=LIMIT`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Exchange Orders Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="exchangeOrder" modelName={t("Exchange Orders")} cardName={t("Orders")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = ExchangeOrdersAnalytics;
exports.permission = "Access Exchange Order Management";
