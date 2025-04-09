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
const constants_1 = require("@/utils/constants");
// Define the API endpoint for admin profits
const api = "/api/admin/finance/profit";
// Define the column configurations for the DataTable
const columnConfig = [
    {
        field: "transaction",
        label: "Transaction ID",
        type: "text",
        getValue: (item) => item.transactionId || "N/A",
        sortable: true,
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        options: constants_1.profitTypeOptions,
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
        field: "currency",
        label: "Currency",
        type: "text",
        sortable: true,
    },
    {
        field: "chain",
        label: "Chain",
        type: "text",
        sortable: true,
    },
    // Created At
    {
        field: "createdAt",
        label: "Date",
        type: "date",
        sortable: true,
        getValue: (item) => item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
    },
];
const AdminProfitManagement = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Profit Management")} color="muted">
      <datatable_1.DataTable title={t("Admin Profits")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics isParanoid={false} canEdit={false}/>
    </Default_1.default>);
};
exports.default = AdminProfitManagement;
exports.permission = "Access Admin Profits";
