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
const api = "/api/admin/ext/ecosystem/utxo";
const columnConfig = [
    {
        field: "wallet.currency",
        label: "Wallet",
        sublabel: "wallet.chain",
        type: "text",
        sortable: true,
    },
    {
        field: "transactionId",
        label: "Transaction ID",
        type: "text",
        sortable: true,
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
        sortable: false,
        api: `${api}/:id/status`,
        options: [
            { value: true, label: "Active", color: "success" },
            { value: false, label: "Inactive", color: "danger" },
        ],
    },
];
const Utxos = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecosystem UTXOs")} color="muted">
      <datatable_1.DataTable title={t("UTXOs")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = Utxos;
exports.permission = "Access Ecosystem UTXO Management";
