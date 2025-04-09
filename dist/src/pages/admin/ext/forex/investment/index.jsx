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
const api = "/api/admin/ext/forex/investment";
const columnConfig = [
    {
        field: "user",
        label: "User",
        sublabel: "user.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.user) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        getSubValue: (item) => { var _a; return (_a = item.user) === null || _a === void 0 ? void 0 : _a.email; },
        path: "/admin/crm/user?email=[user.email]",
        sortable: true,
        sortName: "user.firstName",
        hasImage: true,
        imageKey: "user.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "profit",
        label: "Profit",
        type: "number",
        sortable: true,
    },
    {
        field: "result",
        label: "Result",
        type: "select",
        options: [
            { value: "WIN", label: "Win" },
            { value: "LOSS", label: "Loss" },
            { value: "DRAW", label: "Draw" },
        ],
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "ACTIVE", label: "Active", color: "primary" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
            { value: "REJECTED", label: "Rejected", color: "warning" },
        ],
        sortable: true,
    },
    {
        field: "endDate",
        label: "End Date",
        type: "date",
        sortable: true,
        filterable: false,
        getValue: (item) => item.endDate
            ? (0, date_fns_1.formatDate)(new Date(item.endDate), "yyyy-MM-dd HH:mm")
            : "N/A",
    },
];
const ForexInvestments = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Forex Investments")} color="muted">
      <datatable_1.DataTable title={t("Forex Investments")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = ForexInvestments;
exports.permission = "Access Forex Investment Management";
