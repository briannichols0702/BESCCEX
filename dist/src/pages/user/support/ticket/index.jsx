"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const next_i18next_1 = require("next-i18next");
const api = "/api/user/support/ticket";
const columnConfig = [
    {
        field: "subject",
        label: "Subject",
        type: "text",
        sortable: true,
    },
    {
        field: "importance",
        label: "Importance",
        type: "select",
        options: [
            {
                value: "LOW",
                label: "Low",
                color: "muted",
            },
            {
                value: "MEDIUM",
                label: "Medium",
                color: "warning",
            },
            {
                value: "HIGH",
                label: "High",
                color: "danger",
            },
        ],
        sortable: true,
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        options: [
            {
                value: "LIVE",
                label: "Live Chat",
                color: "success",
            },
            {
                value: "TICKET",
                label: "Ticket",
                color: "info",
            },
        ],
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: [
            {
                value: "PENDING",
                label: "Pending",
                color: "warning",
            },
            {
                value: "OPEN",
                label: "Open",
                color: "info",
            },
            {
                value: "REPLIED",
                label: "Replied",
                color: "primary",
            },
            {
                value: "CLOSED",
                label: "Closed",
                color: "success",
            },
        ],
        sortable: true,
    },
];
const SupportTickets = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Support Tickets")} color="muted">
      <datatable_1.DataTable title={t("Support Tickets")} endpoint={api} columnConfig={columnConfig} hasStructure={true} canCreate={true} canDelete={false} canEdit={false} isParanoid={false} viewPath="/user/support/ticket/[id]"/>
    </Default_1.default>);
};
exports.default = SupportTickets;
