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
const path = "/admin/ext/ico/contribution";
const IcoContributionsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "PENDING",
                label: "pending",
                color: "warning",
                icon: "ph:circle",
                path: `${path}?status=PENDING`,
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
    return (<Default_1.default color="muted" title={t("Ico Contributions Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="icoContribution" modelName={t("Ico Contributions")} cardName={t("Contributions")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = IcoContributionsAnalytics;
exports.permission = "Access ICO Contribution Management";
