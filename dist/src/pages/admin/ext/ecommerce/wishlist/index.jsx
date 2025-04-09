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
const api = "/api/admin/ext/ecommerce/wishlist";
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
        field: "products",
        label: "Products",
        type: "tags",
        key: "name",
        sortable: false,
        filterable: false,
        path: "/admin/ext/ecommerce/product?name={name}",
    },
];
const EcommerceWishlists = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecommerce Wishlists")} color="muted">
      <datatable_1.DataTable title={t("Ecommerce Wishlists")} endpoint={api} columnConfig={columnConfig} hasStructure={false} canCreate={false} canView={false} canEdit={false}/>
    </Default_1.default>);
};
exports.default = EcommerceWishlists;
exports.permission = "Access Ecommerce Wishlist Management";
