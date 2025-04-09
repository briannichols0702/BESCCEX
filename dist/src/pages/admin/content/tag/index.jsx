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
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const api = "/api/admin/content/tag";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        sublabel: "slug",
        type: "text",
        sortable: true,
    },
    {
        field: "createdAt",
        label: "Created At",
        type: "text",
        sortable: true,
        getValue: (row) => (0, date_fns_1.formatDate)(new Date(row.createdAt), "yyyy-MM-dd"),
    },
    {
        field: "posts",
        label: "Posts",
        type: "number",
        sortable: true,
        filterable: false,
        getValue: (row) => { var _a; return (_a = row.posts) === null || _a === void 0 ? void 0 : _a.length; },
    },
];
const Tags = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Tags")} color="muted">
      <datatable_1.DataTable title={t("Tags")} endpoint={api} columnConfig={columnConfig} viewPath="/blog/tag/[slug]"/>
    </Default_1.default>);
};
exports.default = Tags;
exports.permission = "Access Tag Management";
