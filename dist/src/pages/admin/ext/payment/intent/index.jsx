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
const api = "/api/admin/ext/payment/intent";
const columnConfig = [
    {
        field: "user",
        label: "User",
        sublabel: "user.email",
        type: "text",
        getValue: (item) => { var _a, _b; return item.user ? `${(_a = item.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.user) === null || _b === void 0 ? void 0 : _b.lastName}` : "N/A"; },
        getSubValue: (item) => { var _a; return (item.user ? (_a = item.user) === null || _a === void 0 ? void 0 : _a.email : "N/A"); },
        path: "/admin/crm/user?email={user.email}",
        sortable: true,
        sortName: "user.firstName",
        hasImage: true,
        imageKey: "user.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "currency",
        label: "Currency",
        type: "text",
        sortable: true,
    },
    {
        field: "tax",
        label: "Tax",
        type: "number",
        sortable: true,
    },
    {
        field: "discount",
        label: "Discount",
        type: "number",
        sortable: true,
    },
    {
        field: "products",
        label: "Products",
        type: "tags",
        key: "name",
        sortable: false,
        filterable: false,
    },
    {
        field: "ipnUrl",
        label: "IPN URL",
        type: "link",
        getValue: (row) => row.ipnUrl,
        sortable: false,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "FAILED", label: "Failed", color: "danger" },
            { value: "EXPIRED", label: "Expired", color: "danger" },
        ],
    },
];
const PaymentIntents = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Payment Intents")} color="muted">
      <datatable_1.DataTable title={t("Payment Intents")} endpoint={api} columnConfig={columnConfig} hasAnalytics isParanoid={false} canCreate={false} canEdit={false}/>
    </Default_1.default>);
};
exports.default = PaymentIntents;
exports.permission = "Access Payment Gateway Management";
