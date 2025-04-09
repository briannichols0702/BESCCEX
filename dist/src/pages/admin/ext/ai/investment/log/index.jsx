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
const api = "/api/admin/ext/ai/investment/log";
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
        field: "market",
        label: "Market",
        type: "text",
        sortable: true,
        sortName: "market",
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
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "COMPLETED", label: "Completed", color: "info" },
            { value: "CANCELLED", label: "Cancelled", color: "warning" },
            { value: "REJECTED", label: "Rejected", color: "danger" },
        ],
    },
    {
        field: "result",
        label: "Result",
        type: "select",
        options: [
            { value: "WIN", label: "Win", color: "success" },
            { value: "LOSS", label: "Loss", color: "danger" },
            { value: "DRAW", label: "Draw", color: "muted" },
        ],
        sortable: true,
    },
];
const AIInvestments = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("AI Investments")} color="muted">
      <datatable_1.DataTable title={t("AI Investments")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = AIInvestments;
exports.permission = "Access AI Investment Management";
