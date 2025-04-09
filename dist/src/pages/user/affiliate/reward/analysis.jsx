"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// pages/chart.tsx
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const AnalyticsChart_1 = require("@/components/charts/AnalyticsChart");
const next_i18next_1 = require("next-i18next");
const path = "/user/affiliate/reward";
const ReferralRewardsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        isClaimed: [
            {
                value: "true",
                label: "claimed",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?isClaimed=true`,
            },
            {
                value: "false",
                label: "unclaimed",
                color: "warning",
                icon: "ph:circle",
                path: `${path}?isClaimed=false`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Referral Rewards Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="mlmReferralReward" modelName={t("Referral Rewards")} cardName={t("Rewards")} availableFilters={availableFilters} color="primary" path={"/api/ext/affiliate/referral/analysis"} pathModel/>
    </Default_1.default>);
};
exports.default = ReferralRewardsAnalytics;
