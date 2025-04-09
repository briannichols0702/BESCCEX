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
const path = "/admin/ext/staking/pool";
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
                value: "COMPLETED",
                label: "completed",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=COMPLETED`,
            },
            {
                value: "INACTIVE",
                label: "inactive",
                color: "warning",
                icon: "ph:x-circle",
                path: `${path}?status=INACTIVE`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Staking Pools Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="stakingPool" modelName={t("Staking Pools")} cardName={t("Pools")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = StakingsAnalytics;
exports.permission = "Access Staking Pool Management";
