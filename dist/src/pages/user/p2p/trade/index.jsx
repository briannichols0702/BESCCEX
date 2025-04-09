"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const next_i18next_1 = require("next-i18next");
const dashboard_1 = require("@/stores/dashboard");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const api = "/api/ext/p2p/trade";
const P2pTrades = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const columnConfig = [
        {
            field: "seller",
            label: "Seller",
            type: "text",
            getValue: (item) => { var _a, _b; return `${(_a = item.seller) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.seller) === null || _b === void 0 ? void 0 : _b.lastName}`; },
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
            sublabel: "offer.walletType",
            type: "text",
            sortable: true,
            hasImage: true,
            imageKey: "offer.currency",
            placeholder: "/img/placeholder.svg",
            path: "/p2p/offer/[offer.id]",
            getImage: (item) => { var _a; return `/img/crypto/${(_a = item.offer) === null || _a === void 0 ? void 0 : _a.currency}.webp`; },
            getValue: (item) => { var _a, _b, _c; return `${(_a = item.offer) === null || _a === void 0 ? void 0 : _a.currency} ${((_b = item.offer) === null || _b === void 0 ? void 0 : _b.chain) ? (_c = item.offer) === null || _c === void 0 ? void 0 : _c.chain : ""}`; },
            getSubValue: (item) => { var _a; return (_a = item.offer) === null || _a === void 0 ? void 0 : _a.walletType; },
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
        {
            field: "type",
            label: "Type",
            type: "text",
            sortable: false,
            filterable: false,
            getValue: (item) => {
                var _a, _b;
                return (<>
            <Tag_1.default color={((_a = item.seller) === null || _a === void 0 ? void 0 : _a.id) === (profile === null || profile === void 0 ? void 0 : profile.id) ? "danger" : "success"} variant={"pastel"}>
              {((_b = item.seller) === null || _b === void 0 ? void 0 : _b.id) === (profile === null || profile === void 0 ? void 0 : profile.id) ? "Sell" : "Buy"}
            </Tag_1.default>
          </>);
            },
        },
    ];
    return (<Default_1.default title={t("P2P Trades")} color="muted">
      <datatable_1.DataTable title={t("P2P Trades")} endpoint={api} columnConfig={columnConfig} canCreate={false} canEdit={false} canDelete={false} viewPath="/user/p2p/trade/[id]" hasAnalytics hasStructure={false}/>
    </Default_1.default>);
};
exports.default = P2pTrades;
