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
const api = "/api/admin/ext/nft/bid";
const columnConfig = [
    {
        field: "bidder",
        label: "Bidder",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.bidder) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.bidder) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        sublabel: "bidder.email",
        getSubValue: (item) => { var _a; return (_a = item.bidder) === null || _a === void 0 ? void 0 : _a.email; },
        hasImage: true,
        imageKey: "bidder.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
        sortable: true,
        sortName: "bidder.firstName",
    },
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
        field: "bidAmount",
        label: "Bid Amount",
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
            { value: "ACCEPTED", label: "Accepted", color: "success" },
            { value: "REJECTED", label: "Rejected", color: "danger" },
            { value: "WITHDRAWN", label: "Withdrawn", color: "muted" },
        ],
    },
];
const NftBids = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("NFT Bids")} color="muted">
      <datatable_1.DataTable title={t("NFT Bids")} endpoint={api} columnConfig={columnConfig} viewPath="/admin/ext/nft/bid/[id]" canCreate={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = NftBids;
exports.permission = "Access NFT Bid Management";
