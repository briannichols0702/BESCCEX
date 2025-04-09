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
const SupportTicketAnalytics = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const availableFilters = {
        // enum('PENDING', 'OPEN', 'REPLIED', 'CLOSED')
        status: [
            {
                value: "PENDING",
                label: "pending",
                color: "warning",
                icon: "ph:circle",
                path: "/admin/crm/support/ticket?status=PENDING",
            },
            {
                value: "OPEN",
                label: "open",
                color: "info",
                icon: "ph:stop-circle",
                path: "/admin/crm/support/ticket?status=OPEN",
            },
            {
                value: "REPLIED",
                label: "replied",
                color: "success",
                icon: "ph:check-circle",
                path: "/admin/crm/support/ticket?status=REPLIED",
            },
            {
                value: "CLOSED",
                label: "closed",
                color: "danger",
                icon: "ph:x-circle",
                path: "/admin/crm/support/ticket?status=CLOSED",
            },
        ],
        // enum('LOW', 'MEDIUM', 'HIGH')
        importance: [
            {
                value: "LOW",
                label: "low",
                color: "success",
                icon: "bx:signal-1",
                path: "/admin/crm/support/ticket?importance=LOW",
            },
            {
                value: "MEDIUM",
                label: "medium",
                color: "warning",
                icon: "bx:signal-3",
                path: "/admin/crm/support/ticket?importance=MEDIUM",
            },
            {
                value: "HIGH",
                label: "high",
                color: "danger",
                icon: "bx:signal-5",
                path: "/admin/crm/support/ticket?importance=HIGH",
            },
        ],
    };
    return (<Default_1.default color="muted" title={t("Support Tickets Analytics")}>
      <AnalyticsChart_1.AnalyticsChart model="supportTicket" modelName={t("Support Tickets")} availableFilters={availableFilters} color="primary"/>
    </Default_1.default>);
};
exports.default = SupportTicketAnalytics;
exports.permission = "Access Support Ticket Management";
