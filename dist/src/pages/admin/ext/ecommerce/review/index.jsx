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
const api = "/api/admin/ext/ecommerce/review";
const columnConfig = [
    {
        field: "user",
        label: "User",
        sublabel: "user.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.user) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        getSubValue: (item) => { var _a; return (_a = item.user) === null || _a === void 0 ? void 0 : _a.email; },
        path: "/admin/crm/user?email=[user.email]",
        sortable: true,
        sortName: "user.firstName",
        hasImage: true,
        imageKey: "user.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
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
        field: "rating",
        label: "Rating",
        type: "rating",
        sortable: true,
    },
    {
        field: "comment",
        label: "Comment",
        type: "text",
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
const EcommerceReviews = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecommerce Reviews")} color="muted">
      <datatable_1.DataTable title={t("Ecommerce Reviews")} endpoint={api} columnConfig={columnConfig} hasAnalytics canCreate={false} canView={false}/>
    </Default_1.default>);
};
exports.default = EcommerceReviews;
exports.permission = "Access Ecommerce Review Management";
