"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const AnalyticsChart_1 = require("@/components/charts/AnalyticsChart");
const next_i18next_1 = require("next-i18next");
const path = "/admin/payment/intent";
const PaymentIntentAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        status: [
            {
                value: "PENDING",
                label: "Pending",
                color: "warning",
                icon: "mdi:progress-clock",
                path: `${path}?status=PENDING`,
            },
            {
                value: "COMPLETED",
                label: "Completed",
                color: "success",
                icon: "mdi:check-circle",
                path: `${path}?status=COMPLETED`,
            },
            {
                value: "FAILED",
                label: "Failed",
                color: "danger",
                icon: "mdi:close-circle",
                path: `${path}?status=FAILED`,
            },
            {
                value: "EXPIRED",
                label: "Expired",
                color: "muted",
                icon: "mdi:timer-off",
                path: `${path}?status=EXPIRED`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Payment Intent Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="paymentIntent" modelName={t("Payment Intents")} cardName={t("Payment Analytics")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = PaymentIntentAnalytics;
exports.permission = "Access Payment Gateway Management";
