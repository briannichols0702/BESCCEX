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
const api = "/api/admin/ext/ico/allocation";
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
        field: "percentage",
        label: "Percentage",
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
const ICOAllocations = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("ICO Allocations")} color="muted">
      <datatable_1.DataTable title={t("ICO Allocations")} endpoint={api} columnConfig={columnConfig} canView={false}/>
    </Default_1.default>);
};
exports.default = ICOAllocations;
exports.permission = "Access ICO Allocation Management";
