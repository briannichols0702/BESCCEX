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
const path = "/admin/finance/order/binary";
const BinaryOrdersAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "PENDING",
                label: "Pending",
                color: "warning",
                icon: "ph:circle",
                path: `${path}?status=PENDING`,
            },
            {
                value: "WIN",
                label: "Win",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=WIN`,
            },
            {
                value: "LOSS",
                label: "Loss",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?status=LOSS`,
            },
            {
                value: "DRAW",
                label: "Draw",
                color: "primary",
                icon: "ph:minus-circle",
                path: `${path}?status=DRAW`,
            },
        ],
        side: [
            {
                value: "RISE",
                label: "Rise",
                color: "success",
                icon: "ph:arrow-up",
                path: `${path}?side=RISE`,
            },
            {
                value: "FALL",
                label: "Fall",
                color: "danger",
                icon: "ph:arrow-down",
                path: `${path}?side=FALL`,
            },
        ],
        type: [
            {
                value: "RISE_FALL",
                label: "Rise/Fall",
                color: "primary",
                icon: "ph:arrows-left-right",
                path: `${path}?type=RISE_FALL`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Binary Orders Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="binaryOrder" modelName={t("Binary Orders")} cardName={t("Orders")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = BinaryOrdersAnalytics;
exports.permission = "Access Binary Order Management";
