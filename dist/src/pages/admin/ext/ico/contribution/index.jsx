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
const api = "/api/admin/ext/ico/contribution";
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
        field: "phase.token.currency",
        label: "Token",
        sublabel: "phase.token.chain",
        type: "text",
        sortable: true,
        sortName: "phase.token.currency",
        hasImage: true,
        imageKey: "phase.token.image",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
        getValue: (row) => { var _a, _b; return (_b = (_a = row.phase) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.currency; },
        getSubValue: (row) => { var _a, _b; return (_b = (_a = row.phase) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.chain; },
    },
    {
        field: "phase.name",
        label: "Phase",
        type: "text",
        sortable: true,
        sortName: "phase.name",
        getValue: (item) => { var _a; return (_a = item.phase) === null || _a === void 0 ? void 0 : _a.name; },
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
            { value: "REJECTED", label: "Rejected", color: "danger" },
        ],
        sortable: true,
    },
];
const ICOContributions = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("ICO Contributions")} color="muted">
      <datatable_1.DataTable title={t("ICO Contributions")} endpoint={api} columnConfig={columnConfig} canView={false} hasAnalytics canCreate={false}/>
    </Default_1.default>);
};
exports.default = ICOContributions;
exports.permission = "Access ICO Contribution Management";
