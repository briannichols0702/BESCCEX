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
const UsersAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "ACTIVE",
                label: "Active",
                color: "success",
                icon: "solar:user-check-bold-duotone",
                path: "/admin/crm/user?status=ACTIVE",
            },
            {
                value: "INACTIVE",
                label: "Inactive",
                color: "danger",
                icon: "solar:user-minus-bold-duotone",
                path: "/admin/crm/user?status=INACTIVE",
            },
            {
                value: "BANNED",
                label: "Banned",
                color: "warning",
                icon: "solar:user-block-bold-duotone",
                path: "/admin/crm/user?status=BANNED",
            },
            {
                value: "SUSPENDED",
                label: "Suspended",
                color: "info",
                icon: "solar:user-cross-bold-duotone",
                path: "/admin/crm/user?status=SUSPENDED",
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Users Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="user" modelName={t("Users")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = UsersAnalytics;
exports.permission = "Access User Management";
