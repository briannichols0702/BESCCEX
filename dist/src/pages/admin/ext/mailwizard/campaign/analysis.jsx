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
const path = "/admin/ext/mailwizard/campaign";
const MailwizardCampaignsAnalytics = () => {
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
                value: "PAUSED",
                label: "paused",
                color: "warning",
                icon: "ph:pause-circle",
                path: `${path}?status=PAUSED`,
            },
            {
                value: "ACTIVE",
                label: "active",
                color: "primary",
                icon: "ph:play-circle",
                path: `${path}?status=ACTIVE`,
            },
            {
                value: "STOPPED",
                label: "stopped",
                color: "danger",
                icon: "ph:stop-circle",
                path: `${path}?status=STOPPED`,
            },
            {
                value: "COMPLETED",
                label: "completed",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=COMPLETED`,
            },
            // TODO: make it CANCELLED
            {
                value: "CANCELLED",
                label: "cancelled",
                color: "muted",
                icon: "ph:x-circle",
                path: `${path}?status=CANCELLED`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Mailwizard Campaigns Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="mailwizardCampaign" modelName={t("Mailwizard Campaigns")} cardName={t("Campaigns")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = MailwizardCampaignsAnalytics;
exports.permission = "Access Mailwizard Campaign Management";
