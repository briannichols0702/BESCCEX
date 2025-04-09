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
const api = "/api/admin/ext/staking/log";
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
        field: "pool.name",
        label: "Pool",
        sublabel: "pool.currency",
        type: "text",
        sortable: true,
        sortName: "pool.name",
        hasImage: true,
        imageKey: "pool.icon",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
        getValue: (item) => { var _a; return (_a = item.pool) === null || _a === void 0 ? void 0 : _a.name; },
        getSubValue: (item) => { var _a; return (_a = item.pool) === null || _a === void 0 ? void 0 : _a.currency; },
    },
    {
        field: "createdAt",
        label: "Start Date",
        type: "text",
        sortable: true,
        getValue: (item) => `${(0, date_fns_1.format)(new Date(item.createdAt), "dd MMM yyyy HH:mm")}`,
    },
    {
        field: "durationId",
        label: "End Date",
        type: "text",
        sortable: true,
        getValue: (item) => item.duration
            ? (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(item.createdAt || new Date()), item.duration.duration), "dd MMM yyyy HH:mm")
            : "N/A",
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "duration.interestRate",
        label: "ROI",
        type: "number",
        sortable: true,
        getValue: (item) => {
            var _a, _b;
            return ((_a = item.duration) === null || _a === void 0 ? void 0 : _a.interestRate)
                ? `${item.amount * (((_b = item.duration) === null || _b === void 0 ? void 0 : _b.interestRate) / 100)}`
                : "N/A";
        },
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "ACTIVE", label: "Active", color: "primary" },
            { value: "RELEASED", label: "Released", color: "info" },
            { value: "COLLECTED", label: "Collected", color: "success" },
        ],
    },
];
const StakingLogs = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Staking Logs")} color="muted">
      <datatable_1.DataTable title={t("Staking Logs")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = StakingLogs;
exports.permission = "Access Staking Management";
