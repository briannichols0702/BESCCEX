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
const api = "/api/admin/finance/withdraw/method";
const columnConfig = [
    {
        field: "title",
        label: "Title",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/avatars/placeholder.webp",
    },
    {
        field: "processingTime",
        label: "Duration",
        type: "text",
        sortable: true,
    },
    {
        field: "fixedFee",
        label: "Fixed Fee",
        type: "number",
        sortable: true,
    },
    {
        field: "percentageFee",
        label: "% Fee",
        type: "number",
        sortable: true,
    },
    {
        field: "minAmount",
        label: "Min",
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
const WithdrawalMethods = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Withdrawal Methods Management")} color="muted">
      <datatable_1.DataTable title={t("Withdrawal Methods")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = WithdrawalMethods;
exports.permission = "Access Withdrawal Method Management";
