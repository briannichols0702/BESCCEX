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
const path = "/admin/finance/transaction";
const TransactionsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "PENDING",
                label: "Pending",
                color: "warning",
                icon: "ph:circle",
                path: `${path}?status=PENDING`,
            },
            {
                value: "COMPLETED",
                label: "Completed",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=COMPLETED`,
            },
            {
                value: "FAILED",
                label: "Failed",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?status=FAILED`,
            },
            {
                value: "CANCELLED",
                label: "Cancelled",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?status=CANCELLED`,
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
            {
                value: "REFUNDED",
                label: "Refunded",
                color: "warning",
                icon: "ph:circle",
                path: `${path}?status=REFUNDED`,
            },
            {
                value: "TIMEOUT",
                label: "Timeout",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?status=TIMEOUT`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Transactions Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="transaction" modelName={t("Transactions")} cardName={t("Transactions")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = TransactionsAnalytics;
exports.permission = "Access Transaction Management";
