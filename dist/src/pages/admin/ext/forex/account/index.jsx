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
const api = "/api/admin/ext/forex/account";
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
        sortName: "user.email",
        hasImage: true,
        imageKey: "user.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "accountId",
        label: "Account",
        sublabel: "broker",
        type: "text",
        sortable: true,
    },
    {
        field: "mt",
        label: "MT",
        type: "select",
        sortable: true,
        options: [
            { value: 4, label: "MT4" },
            { value: 5, label: "MT5" },
        ],
    },
    {
        field: "balance",
        label: "Balance",
        type: "number",
        sortable: true,
    },
    {
        field: "leverage",
        label: "Leverage",
        type: "number",
        sortable: true,
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        sortable: true,
        options: [
            { value: "DEMO", label: "Demo" },
            { value: "LIVE", label: "Live" },
        ],
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const ForexAccounts = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Forex Accounts")} color="muted">
      <datatable_1.DataTable title={t("Forex Accounts")} endpoint={api} columnConfig={columnConfig} hasAnalytics/>
    </Default_1.default>);
};
exports.default = ForexAccounts;
exports.permission = "Access Forex Account Management";
