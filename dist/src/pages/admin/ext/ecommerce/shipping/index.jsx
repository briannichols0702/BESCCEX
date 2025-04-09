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
const api = "/api/admin/ext/ecommerce/shipping";
const columnConfig = [
    {
        field: "loadId",
        label: "ID",
        type: "text",
        sortable: true,
    },
    {
        field: "shipper",
        label: "Shipper",
        type: "text",
        sortable: true,
    },
    {
        field: "transporter",
        label: "Transporter",
        type: "text",
        sortable: true,
    },
    {
        field: "deliveryDate",
        label: "Delivery",
        type: "datetime",
        sortable: true,
    },
    {
        field: "loadStatus",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "TRANSIT", label: "In Transit", color: "info" },
            { value: "DELIVERED", label: "Delivered", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
        ],
    },
];
const EcommerceShipping = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecommerce Shipping")} color="muted">
      <datatable_1.DataTable title={t("Ecommerce Shipping")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = EcommerceShipping;
exports.permission = "Access Ecommerce Shipping Management";
