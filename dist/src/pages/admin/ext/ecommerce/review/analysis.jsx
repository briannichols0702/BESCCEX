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
const path = "/admin/ext/ecommerce/review";
const EcommerceReviewsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "true",
                label: "Active",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=true`,
            },
            {
                value: "false",
                label: "Disabled",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?status=false`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Ecommerce Reviews Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="ecommerceReview" modelName={t("Ecommerce Reviews")} cardName={t("Reviews")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = EcommerceReviewsAnalytics;
exports.permission = "Access Ecommerce Review Management";
