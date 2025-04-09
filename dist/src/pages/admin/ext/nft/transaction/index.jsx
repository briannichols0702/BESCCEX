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
const api = "/api/admin/ext/nft/transaction";
const columnConfig = [
    {
        field: "nftAsset.name",
        label: "NFT Asset",
        type: "text",
        sortable: true,
        getValue: (item) => { var _a; return (_a = item.nftAsset) === null || _a === void 0 ? void 0 : _a.name; },
        hasImage: true,
        imageKey: "nftAsset.image",
        placeholder: "/img/placeholder.svg",
    },
    {
        field: "seller",
        label: "Seller",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.seller) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.seller) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        sublabel: "seller.email",
        getSubValue: (item) => { var _a; return (_a = item.seller) === null || _a === void 0 ? void 0 : _a.email; },
        hasImage: true,
        imageKey: "seller.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
        sortable: true,
        sortName: "seller.firstName",
    },
    {
        field: "buyer",
        label: "Buyer",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.buyer) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.buyer) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        sublabel: "buyer.email",
        getSubValue: (item) => { var _a; return (_a = item.buyer) === null || _a === void 0 ? void 0 : _a.email; },
        hasImage: true,
        imageKey: "buyer.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
        sortable: true,
        sortName: "buyer.firstName",
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
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "FAILED", label: "Failed", color: "danger" },
        ],
    },
];
const NftTransactions = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("NFT Transactions")} color="muted">
      <datatable_1.DataTable title={t("NFT Transactions")} endpoint={api} columnConfig={columnConfig} canCreate={false} viewPath="/admin/ext/nft/transaction/[id]" hasAnalytics/>
    </Default_1.default>);
};
exports.default = NftTransactions;
exports.permission = "Access NFT Transaction Management";
