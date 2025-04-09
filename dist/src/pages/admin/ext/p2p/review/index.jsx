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
const api = "/api/admin/ext/p2p/review";
const columnConfig = [
    {
        field: "reviewer",
        label: "Reviewer",
        sublabel: "reviewer.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.reviewer) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.reviewer) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        getSubValue: (item) => { var _a; return (_a = item.reviewer) === null || _a === void 0 ? void 0 : _a.email; },
        path: "/admin/crm/user?email=[reviewer.email]",
        sortable: true,
        sortName: "reviewer.firstName",
        hasImage: true,
        imageKey: "reviewer.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "reviewed",
        label: "Reviewed",
        sublabel: "reviewed.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.reviewed) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.reviewed) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        getSubValue: (item) => { var _a; return (_a = item.reviewed) === null || _a === void 0 ? void 0 : _a.email; },
        path: "/admin/crm/user?email=[reviewed.email]",
        sortable: true,
        sortName: "reviewed.firstName",
        hasImage: true,
        imageKey: "reviewed.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "offerId",
        label: "Offer ID",
        type: "text",
        sortable: true,
    },
    {
        field: "rating",
        label: "Rating",
        type: "rating",
        sortable: true,
    },
    {
        field: "comment",
        label: "Comment",
        type: "text",
        sortable: false,
    },
];
const P2pReviews = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("P2P Reviews")} color="muted">
      <datatable_1.DataTable title={t("P2P Reviews")} endpoint={api} columnConfig={columnConfig} canCreate={false}/>
    </Default_1.default>);
};
exports.default = P2pReviews;
exports.permission = "Access P2P Review Management";
