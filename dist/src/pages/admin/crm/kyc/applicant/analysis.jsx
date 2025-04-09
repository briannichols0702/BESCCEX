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
const KycApplicantsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "PENDING",
                label: "pending",
                color: "warning",
                icon: "ph:circle",
                path: "/admin/crm/kyc?status=PENDING",
            },
            {
                value: "APPROVED",
                label: "approved",
                color: "success",
                icon: "ph:check-circle",
                path: "/admin/crm/kyc?status=APPROVED",
            },
            {
                value: "REJECTED",
                label: "rejected",
                color: "danger",
                icon: "ph:x-circle",
                path: "/admin/crm/kyc?status=REJECTED",
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("KYC Applicants Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="kyc" modelName={t("KYC Applicants")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = KycApplicantsAnalytics;
exports.permission = "Access KYC Application Management";
