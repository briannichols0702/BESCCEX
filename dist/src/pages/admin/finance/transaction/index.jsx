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
const constants_1 = require("@/utils/constants");
const next_i18next_1 = require("next-i18next");
const api = "/api/admin/finance/transaction";
const columnConfig = [
    {
        field: "id",
        label: "Transaction ID",
        type: "text",
        sortable: true,
    },
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
        field: "walletId",
        label: "Wallet Currency",
        sublabel: "walletId",
        type: "text",
        sortable: true,
        getValue: (item) => { var _a, _b; return `${(_a = item.wallet) === null || _a === void 0 ? void 0 : _a.currency} (${(_b = item.wallet) === null || _b === void 0 ? void 0 : _b.type})`; },
        getSubValue: (item) => item.walletId,
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        options: constants_1.transactionTypeOptions,
        sortable: true,
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        precision: 8,
        sortable: true,
    },
    {
        field: "fee",
        label: "Fee",
        type: "number",
        precision: 8,
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: constants_1.statusOptions,
        sortable: true,
    },
    {
        field: "createdAt",
        label: "Date",
        type: "date",
        sortable: true,
        filterable: false,
        getValue: (item) => item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
    },
];
const WalletTransactions = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Transactions Management")} color="muted">
      <datatable_1.DataTable title={t("Transactions")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = WalletTransactions;
exports.permission = "Access Transaction Management";
