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
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const link_1 = __importDefault(require("next/link"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const api = "/api/admin/ext/ecommerce/product";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
        getValue: (item) => (0, lodash_1.capitalize)(item.name),
    },
    {
        field: "category",
        label: "Category",
        type: "tag",
        getValue: (item) => { var _a; return (0, lodash_1.capitalize)((_a = item.category) === null || _a === void 0 ? void 0 : _a.name); },
        color: "primary",
        path: "/admin/ext/ecommerce/category?name=[name]",
        sortable: true,
        sortName: "category.name",
    },
    {
        field: "type",
        label: "Type",
        type: "text",
        sortable: true,
        getValue: (item) => (0, lodash_1.capitalize)(item.type),
    },
    {
        field: "ecommerceReviews",
        label: "Rating",
        type: "rating",
        getValue: (data) => {
            if (!data.ecommerceReviews.length)
                return 0;
            const rating = data.ecommerceReviews.reduce((acc, review) => acc + review.rating, 0);
            return rating / data.ecommerceReviews.length;
        },
        sortable: true,
        sortName: "ecommerceReviews.rating",
    },
    {
        field: "price",
        label: "Price",
        type: "number",
        sortable: true,
        getValue: (item) => `${item.price} ${item.currency}`,
    },
    {
        field: "inventoryQuantity",
        label: "Stock",
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
const EcommerceProducts = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecommerce Products")} color="muted">
      <datatable_1.DataTable title={t("Ecommerce Products")} endpoint={api} columnConfig={columnConfig} hasAnalytics canCreate={false} editPath="/admin/ext/ecommerce/product/[id]" navSlot={<>
            <link_1.default color="success" href="/admin/ext/ecommerce/product/create">
              <IconButton_1.default variant="pastel" aria-label="Create Staking Pool" color="success" size="lg">
                <react_2.Icon icon={"mdi-plus"} className="h-6 w-6"/>
              </IconButton_1.default>
            </link_1.default>
          </>}/>
    </Default_1.default>);
};
exports.default = EcommerceProducts;
exports.permission = "Access Ecommerce Product Management";
