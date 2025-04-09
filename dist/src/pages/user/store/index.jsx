"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const next_i18next_1 = require("next-i18next");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const api = "/api/ext/ecommerce/order";
const columnConfig = [
    {
        field: "id",
        label: "ID",
        type: "text",
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
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
            { value: "REJECTED", label: "Rejected", color: "muted" },
        ],
    },
];
const EcommerceOrders = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Store Orders")} color="muted">
      <datatable_1.DataTable title={t("Store Orders")} endpoint={api} columnConfig={columnConfig} canCreate={false} canDelete={false} canEdit={false} hasStructure={false} viewPath="/user/store/[id]" hasAnalytics navSlot={<>
            <BackButton_1.BackButton size="lg" href={"/store"}>
              {t("Back to Store")}
            </BackButton_1.BackButton>
          </>}/>
    </Default_1.default>);
};
exports.default = EcommerceOrders;
