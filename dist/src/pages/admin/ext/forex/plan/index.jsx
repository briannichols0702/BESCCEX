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
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const api = "/api/admin/ext/forex/plan";
const columnConfig = [
    {
        field: "title",
        label: "Plan",
        sublabel: "createdAt",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
        getSubValue: (item) => item.createdAt
            ? (0, date_fns_1.formatDate)(new Date(item.createdAt), "MMM dd, yyyy")
            : "N/A",
    },
    {
        field: "minProfit",
        label: "Profit",
        sublabel: "maxProfit",
        type: "number",
        sortable: true,
    },
    {
        field: "minAmount",
        label: "Amount",
        sublabel: "maxAmount",
        type: "number",
        sortable: true,
    },
    {
        field: "trending",
        label: "Trending",
        type: "select",
        options: [
            { value: true, label: "Yes", color: "success" },
            { value: false, label: "No", color: "danger" },
        ],
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const ForexPlans = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Forex Plans")} color="muted">
      <datatable_1.DataTable title={t("Forex Plans")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = ForexPlans;
exports.permission = "Access Forex Plan Management";
