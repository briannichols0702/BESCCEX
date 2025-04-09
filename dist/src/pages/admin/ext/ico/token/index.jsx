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
const api = "/api/admin/ext/ico/token";
const columnConfig = [
    {
        field: "currency",
        label: "Name",
        sublabel: "chain",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
    },
    // address
    {
        field: "address",
        label: "Address",
        type: "text",
        sortable: true,
    },
    // name
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
    },
    {
        field: "totalSupply",
        label: "Total Supply",
        type: "number",
        sortable: true,
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
const ICOTokens = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("ICO Tokens")} color="muted">
      <datatable_1.DataTable title={t("ICO Tokens")} endpoint={api} columnConfig={columnConfig} hasAnalytics/>
    </Default_1.default>);
};
exports.default = ICOTokens;
exports.permission = "Access ICO Token Management";
