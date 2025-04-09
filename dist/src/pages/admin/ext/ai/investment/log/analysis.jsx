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
const path = "/admin/ext/ai/investment/log";
const AiInvestmentsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
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
        result: [
            {
                value: "WIN",
                label: "win",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?result=WIN`,
            },
            {
                value: "LOSS",
                label: "loss",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?result=LOSS`,
            },
            {
                value: "DRAW",
                label: "draw",
                color: "warning",
                icon: "ph:circle",
                path: `${path}?result=DRAW`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("AI Investments Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="aiInvestment" modelName={t("AI Investments")} cardName={t("Investments")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = AiInvestmentsAnalytics;
exports.permission = "Access AI Investment Management";
