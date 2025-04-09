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
const date_fns_1 = require("date-fns");
const api = "/api/admin/ext/futures/order";
const columnConfig = [
    {
        field: "createdAt",
        label: "Date",
        type: "date",
        sortable: true,
        filterable: false,
        getValue: (row) => (0, date_fns_1.formatDate)(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
    },
    {
        field: "symbol",
        label: "Symbol",
        type: "text",
        sortable: false,
        filterable: false,
    },
    {
        field: "type",
        label: "Type",
        type: "text",
        sortable: false,
        filterable: false,
        options: [
            { value: "LIMIT", label: "Limit" },
            { value: "MARKET", label: "Market" },
        ],
        placeholder: "Select type",
    },
    {
        field: "side",
        label: "Side",
        type: "text",
        sortable: false,
        filterable: false,
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
        sortable: false,
        filterable: false,
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: false,
        filterable: false,
    },
    {
        field: "fee",
        label: "Fee",
        type: "number",
        sortable: false,
        filterable: false,
        getValue: (item) => `${item.fee} ${item.feeCurrency}`,
    },
    {
        field: "status",
        label: "Status",
        type: "text",
        sortable: false,
        filterable: false,
        api: `${api}/:id/status`,
        options: [
            { value: "OPEN", label: "Open" },
            { value: "CLOSED", label: "Closed" },
            { value: "CANCELLED", label: "Cancelled" },
        ],
        placeholder: "Select status",
    },
];
const FuturesOrders = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Futures Orders Management")} color="muted">
      <datatable_1.DataTable title={t("Futures Orders")} endpoint={api} columnConfig={columnConfig} isCrud={false} canCreate={false} hasAnalytics={false} canEdit={false} canDelete={false} canView={false}/>
    </Default_1.default>);
};
exports.default = FuturesOrders;
exports.permission = "Access Futures Order Management";
