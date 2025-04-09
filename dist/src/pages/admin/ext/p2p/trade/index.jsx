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
const api = "/api/admin/ext/p2p/trade";
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
        field: "seller",
        label: "Seller",
        sublabel: "seller.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.seller) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.seller) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        getSubValue: (item) => { var _a; return (_a = item.seller) === null || _a === void 0 ? void 0 : _a.email; },
        path: "/admin/crm/user?email=[seller.email]",
        sortable: true,
        sortName: "seller.firstName",
        hasImage: true,
        imageKey: "seller.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "offerId",
        label: "Offer",
        type: "text",
        sortable: true,
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "PAID", label: "Paid", color: "success" },
            { value: "DISPUTE_OPEN", label: "Dispute Open", color: "danger" },
            { value: "ESCROW_REVIEW", label: "Escrow Review", color: "info" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "REFUNDED", label: "Refunded", color: "danger" },
        ],
    },
];
const P2pTrades = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("P2P Trades")} color="muted">
      <datatable_1.DataTable title={t("P2P Trades")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics viewPath="/admin/ext/p2p/trade/[id]"/>
    </Default_1.default>);
};
exports.default = P2pTrades;
exports.permission = "Access P2P Trade Management";
