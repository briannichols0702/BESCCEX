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
const api = "/api/admin/finance/order/exchange";
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
        field: "symbol",
        label: "Symbol",
        type: "text",
        sortable: true,
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        sortable: true,
        options: [
            { value: "LIMIT", label: "Limit" },
            { value: "MARKET", label: "Market" },
        ],
        placeholder: "Select type",
    },
    {
        field: "side",
        label: "Side",
        type: "select",
        sortable: true,
        options: [
            { value: "BUY", label: "Buy" },
            { value: "SELL", label: "Sell" },
        ],
        placeholder: "Select Side",
    },
    {
        field: "price",
        label: "Price",
        type: "number",
        sortable: true,
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "fee",
        label: "Fee",
        type: "number",
        sortable: true,
        getValue: (item) => `${item.fee} ${item.feeCurrency}`,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        api: `${api}/:id/status`,
        options: [
            { value: "OPEN", label: "Open" },
            { value: "CLOSED", label: "Closed" },
            { value: "CANCELLED", label: "Cancelled" },
        ],
        placeholder: "Select status",
    },
];
const ExchangeOrders = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Exchange Orders Management")} color="muted">
      <datatable_1.DataTable title={t("Exchange Orders")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = ExchangeOrders;
exports.permission = "Access Exchange Order Management";
