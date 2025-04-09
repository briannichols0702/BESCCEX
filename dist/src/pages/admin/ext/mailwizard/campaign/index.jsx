"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const next_i18next_1 = require("next-i18next");
const api = "/api/admin/ext/mailwizard/campaign";
const columnConfig = [
    {
        field: "name",
        label: "Campaign",
        type: "text",
        sortable: true,
    },
    {
        field: "template.name",
        label: "Template",
        type: "text",
        sortable: false,
        getValue: (row) => { var _a; return (_a = row.template) === null || _a === void 0 ? void 0 : _a.name; },
    },
    {
        field: "speed",
        label: "Speed",
        type: "number",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "PAUSED", label: "Paused", color: "warning" },
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "STOPPED", label: "Stopped", color: "danger" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
        ],
        sortable: true,
    },
];
const MailwizardCampaigns = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Mailwizard Campaigns")} color="muted">
      <datatable_1.DataTable title={t("Mailwizard Campaigns")} endpoint={api} columnConfig={columnConfig} hasAnalytics viewPath="/admin/ext/mailwizard/campaign/[id]"/>
    </Default_1.default>);
};
exports.default = MailwizardCampaigns;
exports.permission = "Access Mailwizard Campaign Management";
