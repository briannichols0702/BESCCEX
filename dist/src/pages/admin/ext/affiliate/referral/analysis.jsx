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
const path = "/admin/ext/affiliate/referral";
const ReferralsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "PENDING",
                label: "pending",
                color: "warning",
                icon: "ph:stop-circle",
                path: `${path}?status=PENDING`,
            },
            {
                value: "ACTIVE",
                label: "active",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=ACTIVE`,
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
    return (<Default_1.default color="muted" title={t("Referrals Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="mlmReferral" modelName={t("Referrals")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = ReferralsAnalytics;
exports.permission = "Access MLM Referral Management";
