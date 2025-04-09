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
const api = "/api/admin/ext/p2p/dispute";
const columnConfig = [
    {
        field: "raisedBy",
        label: "User",
        sublabel: "raisedBy.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.raisedBy) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.raisedBy) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        getSubValue: (item) => { var _a; return (_a = item.raisedBy) === null || _a === void 0 ? void 0 : _a.email; },
        path: "/admin/crm/user?email=[raisedBy.email]",
        sortable: true,
        sortName: "raisedBy.firstName",
        hasImage: true,
        imageKey: "raisedBy.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "tradeId",
        label: "Trade ID",
        type: "text",
        sortable: true,
    },
    {
        field: "reason",
        label: "Reason",
        type: "text",
        sortable: true,
    },
    {
        field: "resolution",
        label: "Resolution",
        type: "text",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "OPEN", label: "Open", color: "info" },
            { value: "RESOLVED", label: "Resolved", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
        ],
    },
];
const P2pDisputes = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("P2P Disputes")} color="muted">
      <datatable_1.DataTable title={t("P2P Disputes")} endpoint={api} columnConfig={columnConfig} canCreate={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = P2pDisputes;
exports.permission = "Access P2P Dispute Management";
