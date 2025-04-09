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
const api = "/api/admin/content/comment";
const columnConfig = [
    {
        field: "post",
        label: "Post",
        sublabel: "post.slug",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
        getValue: (item) => { var _a; return (_a = item.post) === null || _a === void 0 ? void 0 : _a.title; },
        path: "/admin/content/post?slug=[post.slug]",
        getSubValue: (item) => { var _a; return (_a = item.post) === null || _a === void 0 ? void 0 : _a.slug; },
    },
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
        field: "content",
        label: "Comment",
        type: "text",
        sortable: true,
    },
];
const Comments = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Comments")} color="muted">
      <datatable_1.DataTable title={t("Comments")} endpoint={api} columnConfig={columnConfig} canCreate={false}/>
    </Default_1.default>);
};
exports.default = Comments;
exports.permission = "Access Comment Management";
