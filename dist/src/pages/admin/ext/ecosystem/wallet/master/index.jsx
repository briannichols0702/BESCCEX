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
const api = "/api/admin/ext/ecosystem/wallet/master";
const columnConfig = [
    {
        field: "chain",
        label: "Chain",
        sublabel: "address",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "chain",
        getImage: (item) => { var _a; return `/img/crypto/${(_a = item.chain) === null || _a === void 0 ? void 0 : _a.toLowerCase()}.webp`; },
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: true,
        api: `${api}/:id/status`,
    },
];
const MasterWallets = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecosystem Master Wallets")} color="muted">
      <datatable_1.DataTable title={t("Master Wallets")} endpoint={api} columnConfig={columnConfig} isParanoid={false} canDelete={false} canEdit={false}/>
    </Default_1.default>);
};
exports.default = MasterWallets;
exports.permission = "Access Ecosystem Master Wallet Management";
