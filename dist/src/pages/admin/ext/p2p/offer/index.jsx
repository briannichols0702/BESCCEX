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
const api = "/api/admin/ext/p2p/offer";
const columnConfig = [
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
        field: "paymentMethod.name",
        label: "Method",
        sublabel: "paymentMethod.currency",
        type: "text",
        sortable: true,
        sortName: "paymentMethod.name",
        getValue: (item) => { var _a; return (_a = item.paymentMethod) === null || _a === void 0 ? void 0 : _a.name; },
        getSubValue: (item) => { var _a; return (_a = item.paymentMethod) === null || _a === void 0 ? void 0 : _a.currency; },
        path: "/admin/ext/p2p/payment/method?name=[paymentMethod.name]",
        hasImage: true,
        imageKey: "paymentMethod.image",
        placeholder: "/img/placeholder.svg",
    },
    {
        field: "currency",
        label: "Currency",
        sublabel: "walletType",
        type: "text",
        sortable: true,
        getValue: (item) => `${item.currency} (${item.chain})`,
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "price",
        label: "Price",
        type: "number",
        sortable: true,
    },
    {
        field: "p2pReviews",
        label: "Rating",
        type: "rating",
        getValue: (data) => {
            if (!data.p2pReviews.length)
                return 0;
            const rating = data.p2pReviews.reduce((acc, review) => acc + review.rating, 0);
            return rating / data.p2pReviews.length;
        },
        sortable: true,
        sortName: "p2pReviews.rating",
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
        ],
    },
];
const P2pOffers = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("P2P Offers")} color="muted">
      <datatable_1.DataTable title={t("P2P Offers")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = P2pOffers;
exports.permission = "Access P2P Offer Management";
