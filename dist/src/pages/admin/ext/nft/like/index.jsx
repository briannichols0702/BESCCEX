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
const api = "/api/admin/ext/nft/like";
const columnConfig = [
    {
        field: "user",
        label: "User",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.user) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        sublabel: "user.email",
        getSubValue: (item) => { var _a; return (_a = item.user) === null || _a === void 0 ? void 0 : _a.email; },
        hasImage: true,
        imageKey: "user.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
        sortable: true,
        sortName: "user.firstName",
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
];
const NftLikes = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("NFT Likes")} color="muted">
      <datatable_1.DataTable title={t("NFT Likes")} endpoint={api} columnConfig={columnConfig} canCreate={false} canEdit={false} canDelete={true} viewPath="/admin/ext/nft/like/[id]"/>
    </Default_1.default>);
};
exports.default = NftLikes;
exports.permission = "Access NFT Like Management";
