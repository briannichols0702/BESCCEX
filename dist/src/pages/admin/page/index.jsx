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
const columnConfig = [
    {
        field: "title",
        label: "Title",
        type: "text",
        sortable: true,
    },
    {
        field: "content",
        label: "Content",
        type: "textarea",
        sortable: false,
    },
    {
        field: "description",
        label: "Description",
        type: "textarea",
        sortable: false,
    },
    {
        field: "image",
        label: "Image",
        type: "file",
        sortable: false,
        fileType: "image",
    },
    {
        field: "slug",
        label: "Slug",
        type: "text",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "PUBLISHED", label: "Published" },
            { value: "DRAFT", label: "Draft" },
        ],
        sortable: true,
    },
];
const Pages = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("CMS Pages Management")} color="muted">
      <datatable_1.DataTable title={t("Pages")} endpoint="/api/admin/page" columnConfig={columnConfig} hasStructure formSize="sm" isCrud isParanoid={false} canCreate canEdit canDelete/>
    </Default_1.default>);
};
exports.default = Pages;
exports.permission = "Access Pages Management";
