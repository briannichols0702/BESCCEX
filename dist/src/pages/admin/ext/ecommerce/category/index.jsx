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
const api = "/api/admin/ext/ecommerce/category";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
    },
    {
        field: "description",
        label: "Description",
        type: "text",
        sortable: false,
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const EcommerceCategories = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecommerce Categories")} color="muted">
      <datatable_1.DataTable title={t("Ecommerce Categories")} endpoint={api} columnConfig={columnConfig} viewPath="/store/category/[id]"/>
    </Default_1.default>);
};
exports.default = EcommerceCategories;
exports.permission = "Access Ecommerce Category Management";
