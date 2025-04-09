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
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const api = "/api/admin/ext/nft/asset";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
        getValue: (item) => (0, lodash_1.capitalize)(item.name),
    },
    {
        field: "creator",
        label: "Creator",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.creator) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.creator) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        sublabel: "creator.email",
        getSubValue: (item) => { var _a; return (_a = item.creator) === null || _a === void 0 ? void 0 : _a.email; },
        hasImage: true,
        imageKey: "creator.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
        sortable: true,
        sortName: "creator.firstName",
    },
    {
        field: "owner",
        label: "Owner",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.owner) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.owner) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        sublabel: "owner.email",
        getSubValue: (item) => { var _a; return (_a = item.owner) === null || _a === void 0 ? void 0 : _a.email; },
        hasImage: true,
        imageKey: "owner.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
        sortable: true,
        sortName: "owner.firstName",
    },
    {
        field: "price",
        label: "Price",
        type: "number",
        sortable: true,
        getValue: (item) => `${item.price} ${item.currency || "USD"}`,
    },
    {
        field: "network",
        label: "Network",
        type: "text",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const NftAssets = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("NFT Assets")} color="muted">
      <datatable_1.DataTable title={t("NFT Assets")} endpoint={api} columnConfig={columnConfig} viewPath="/admin/ext/nft/asset/[id]"/>
    </Default_1.default>);
};
exports.default = NftAssets;
exports.permission = "Access NFT Asset Management";
