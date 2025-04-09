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
const api = "/api/admin/ext/ecommerce/discount";
const columnConfig = [
    {
        field: "product",
        label: "Product",
        sublabel: "category",
        type: "text",
        getValue: (item) => { var _a; return (_a = item.product) === null || _a === void 0 ? void 0 : _a.name; },
        getSubValue: (item) => { var _a, _b; return (_b = (_a = item.product) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.name; },
        path: "/admin/ext/ecommerce/product?name=[product.name]",
        subpath: "/admin/ext/ecommerce/category?name=[product.category.name]",
        sortable: true,
        sortName: "product.name",
        hasImage: true,
        imageKey: "product.image",
        placeholder: "/img/placeholder.svg",
    },
    {
        field: "code",
        label: "Code",
        type: "text",
        sortable: true,
    },
    {
        field: "percentage",
        label: "Percentage",
        type: "number",
        sortable: true,
        getValue: (item) => item.percentage + "%",
    },
    {
        field: "validUntil",
        label: "Valid Until",
        type: "datetime",
        sortable: true,
        filterable: false,
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const EcommerceDiscounts = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecommerce Discounts")} color="muted">
      <datatable_1.DataTable title={t("Ecommerce Discounts")} endpoint={api} columnConfig={columnConfig} canView={false}/>
    </Default_1.default>);
};
exports.default = EcommerceDiscounts;
exports.permission = "Access Ecommerce Discount Management";
