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
const api = "/api/admin/ext/nft/auction";
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
        field: "startTime",
        label: "Start Time",
        type: "date",
        sortable: true,
    },
    {
        field: "endTime",
        label: "End Time",
        type: "date",
        sortable: true,
    },
    {
        field: "startingBid",
        label: "Starting Bid",
        type: "number",
        sortable: true,
    },
    {
        field: "reservePrice",
        label: "Reserve Price",
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
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "ENDED", label: "Ended", color: "muted" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
        ],
    },
];
const NftAuctions = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("NFT Auctions")} color="muted">
      <datatable_1.DataTable title={t("NFT Auctions")} endpoint={api} columnConfig={columnConfig} viewPath="/admin/ext/nft/auction/[id]"/>
    </Default_1.default>);
};
exports.default = NftAuctions;
exports.permission = "Access NFT Auction Management";
