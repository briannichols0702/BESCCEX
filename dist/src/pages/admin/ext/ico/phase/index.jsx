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
const api = "/api/admin/ext/ico/phase";
const columnConfig = [
    {
        field: "token.currency",
        label: "Token",
        sublabel: "token.chain",
        type: "text",
        sortable: true,
        sortName: "token.currency",
        hasImage: true,
        imageKey: "token.image",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
        getValue: (row) => { var _a; return (_a = row.token) === null || _a === void 0 ? void 0 : _a.currency; },
        getSubValue: (row) => { var _a; return (_a = row.token) === null || _a === void 0 ? void 0 : _a.chain; },
    },
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
    },
    {
        field: "price",
        label: "Price",
        type: "number",
        sortable: true,
    },
    {
        field: "minPurchase",
        label: "Limit",
        sublabel: "maxPurchase",
        type: "number",
        sortable: true,
    },
    {
        field: "startDate",
        label: "Date",
        sublabel: "endDate",
        type: "date",
        sortable: true,
        filterable: false,
        getValue: (row) => row.startDate && (0, date_fns_1.formatDate)(new Date(row.startDate), "dd/MM/yyyy"),
        getSubValue: (row) => row.endDate && (0, date_fns_1.formatDate)(new Date(row.endDate), "dd/MM/yyyy"),
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "REJECTED", label: "Rejected", color: "danger" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
        ],
        sortable: true,
    },
];
const ICOPhases = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("ICO Phases")} color="muted">
      <datatable_1.DataTable title={t("ICO Phases")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = ICOPhases;
exports.permission = "Access ICO Phase Management";
