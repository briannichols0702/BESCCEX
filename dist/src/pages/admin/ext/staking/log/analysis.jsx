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
const path = "/admin/ext/staking/log";
const StakingsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "ACTIVE",
                label: "active",
                color: "success",
                icon: "ph:circle",
                path: `${path}?status=ACTIVE`,
            },
            {
                value: "RELEASED",
                label: "released",
                color: "info",
                icon: "mingcute:alert-line",
                path: `${path}?status=RELEASED`,
            },
            {
                value: "COLLECTED",
                label: "collected",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=COLLECTED`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Staking Rewards Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="stakingLog" modelName={t("Staking Rewards")} cardName={t("Rewards")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = StakingsAnalytics;
exports.permission = "Access Staking Management";
