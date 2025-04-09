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
const P2pCommissionsAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default color="muted" title={t("P2P Commissions Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="p2pCommission" modelName={t("P2P Commissions")} cardName={t("Commissions")} color="primary"/>
    </Default_1.default>);
};
exports.default = P2pCommissionsAnalytics;
exports.permission = "Access P2P Commission Management";
