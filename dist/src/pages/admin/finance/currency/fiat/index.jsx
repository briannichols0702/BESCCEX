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
const api = "/api/admin/finance/currency/fiat";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
    },
    {
        field: "symbol",
        label: "Symbol",
        type: "text",
        sortable: true,
    },
    {
        field: "precision",
        label: "Precision",
        type: "number",
        sortable: true,
    },
    {
        field: "price",
        label: "Price",
        type: "number",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const Currencies = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Currencies Management")} color="muted">
      <datatable_1.DataTable title={t("Currencies")} endpoint={api} columnConfig={columnConfig} canCreate={false} canView={false} canDelete={false} isParanoid={false}/>
    </Default_1.default>);
};
exports.default = Currencies;
exports.permission = "Access Fiat Currency Management";
