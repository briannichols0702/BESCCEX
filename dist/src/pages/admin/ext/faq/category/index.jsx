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
const api = "/api/admin/ext/faq/category";
const columnConfig = [
    {
        field: "id",
        label: "id",
        type: "text",
        sortable: true,
        getValue: (row) => (0, lodash_1.capitalize)(row.id),
    },
];
const FaqCategories = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("FAQ Categories")} color="muted">
      <datatable_1.DataTable title={t("FAQ Categories")} endpoint={api} columnConfig={columnConfig} isCrud={false}/>
    </Default_1.default>);
};
exports.default = FaqCategories;
exports.permission = "Access FAQ Category Management";
