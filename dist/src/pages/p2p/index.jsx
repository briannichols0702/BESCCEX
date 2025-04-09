"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
const next_i18next_1 = require("next-i18next");
const api = "/api/ext/p2p/offer";
const columnConfig = [
    {
        field: "user",
        label: "Seller",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.user) === null || _b === void 0 ? void 0 : _b.lastName}`; },
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
        getValue: (item) => `${item.currency} ${item.chain ? `(${item.chain})` : ""}`,
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
];
const P2pOffers = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("P2P Offers")} color="muted">
      <datatable_1.DataTable title={t("P2P")} postTitle={t("Offers")} hasBreadcrumb={false} hasRotatingBackButton={false} endpoint={api} columnConfig={columnConfig} canDelete={false} canCreate={false} canEdit={false} hasStructure={false} hasAnalytics={false} isParanoid={false} viewPath="/p2p/offer/[id]"/>
      <Faq_1.Faq category="P2P"/>
    </Default_1.default>);
};
exports.default = P2pOffers;
