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
const path = "/admin/ext/p2p/escrow";
const P2PsAnalytics = () => {
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
                value: "HELD",
                label: "held",
                color: "primary",
                icon: "ph:stop-circle",
                path: `${path}?status=HELD`,
            },
            {
                value: "RELEASED",
                label: "released",
                color: "success",
                icon: "ph:check-circle",
                path: `${path}?status=RELEASED`,
            },
            {
                value: "CANCELLED",
                label: "cancelled",
                color: "danger",
                icon: "ph:x-circle",
                path: `${path}?status=CANCELLED`,
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("P2P Escrows Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="p2pEscrow" modelName={t("P2P Escrows")} cardName={t("Escrows")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = P2PsAnalytics;
exports.permission = "Access P2P Escrow Management";
