"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const router_1 = require("next/router");
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
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
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const api = `/api/content/author/${id}`;
    return (<Default_1.default title={t("Posts")} color="muted">
      {router.isReady && (<datatable_1.DataTable title={t("Posts")} endpoint={api} columnConfig={columnConfig} hasStructure={false} viewPath="/blog/post/[slug]" editPath="/user/blog/post?category=[category.slug]&id=[id]" canCreate={false} navSlot={<IconBox_1.default color="primary" onClick={() => router.push("/user/blog/post")} size={"sm"} shape={"rounded-sm"} variant={"pastel"} className="cursor-pointer hover:shadow-sm transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-primary-500 hover:text-muted-100" icon="mdi:plus"/>}/>)}
    </Default_1.default>);
};
exports.default = Posts;
