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
const api = "/api/admin/content/post";
const columnConfig = [
    {
        field: "title",
        label: "Title",
        sublabel: "slug",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
    },
    {
        field: "author.user",
        label: "Author",
        sublabel: "author.user.email",
        type: "text",
        getValue: (item) => { var _a, _b, _c, _d; return `${(_b = (_a = item.author) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.firstName} ${(_d = (_c = item.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.lastName}`; },
        getSubValue: (item) => { var _a, _b; return (_b = (_a = item.author) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.email; },
        path: "/admin/crm/user?email=[author.user.email]",
        sortable: true,
        sortName: "author.user.firstName",
        hasImage: true,
        imageKey: "author.user.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "category",
        label: "Category",
        type: "tag",
        sortable: true,
        sortName: "category.name",
        getValue: (row) => { var _a; return (_a = row.category) === null || _a === void 0 ? void 0 : _a.name; },
        path: "/admin/content/category?name=[category.name]",
        color: "primary",
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "DRAFT", label: "Draft", color: "warning" },
            { value: "PUBLISHED", label: "Published", color: "success" },
        ],
    },
    {
        field: "createdAt",
        label: "Created At",
        type: "datetime",
        sortable: true,
        filterable: false,
        getValue: (row) => (0, date_fns_1.formatDate)(new Date(row.createdAt), "yyyy-MM-dd"),
    },
];
const Posts = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Posts")} color="muted">
      <datatable_1.DataTable title={t("Posts")} endpoint={api} columnConfig={columnConfig} hasStructure={false} viewPath="/blog/post/[slug]" editPath="/admin/content/post/[category.slug]/[id]" canCreate={false}/>
    </Default_1.default>);
};
exports.default = Posts;
exports.permission = "Access Post Management";
