"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const datatable_1 = require("@/components/elements/base/datatable");
require("react-loading-skeleton/dist/skeleton.css");
const link_1 = __importDefault(require("next/link"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const api = "/api/finance/wallet";
const columnConfig = [
    {
        field: "currency",
        label: "Currency",
        type: "text",
        sortable: true,
        getValue: (row) => {
            var _a;
            return (<div className="flex items-center gap-3">
        <Avatar_1.default size="sm" src={row.type === "ECO"
                    ? row.icon || "/img/placeholder.svg"
                    : `/img/crypto/${(_a = row.currency) === null || _a === void 0 ? void 0 : _a.toLowerCase()}.webp`} alt={row.currency}/>
        <span>{row.currency}</span>
      </div>);
        },
    },
    {
        field: "balance",
        label: "Balance",
        type: "number",
        sortable: true,
    },
    {
        field: "inOrder",
        label: "In Order",
        type: "number",
        sortable: true,
    },
];
const WalletDashboard = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { walletType } = router.query;
    return (<Default_1.default title={t("Wallets Dashboard")} color="muted">
      {walletType && (<datatable_1.DataTable title={`${walletType}`} postTitle={t("Wallets")} endpoint={api} columnConfig={columnConfig} hasStructure={false} canDelete={false} canEdit={false} canCreate={false} viewPath="/user/wallet/[type]/[currency]" blank={false} navSlot={<div className="flex items-center gap-2">
              {[
                    { value: "", label: "ALL", color: "muted" },
                    { value: "FIAT", label: "Fiat", color: "warning" },
                    { value: "SPOT", label: "Spot", color: "info" },
                    { value: "ECO", label: "Funding", color: "primary" },
                ]
                    .filter((option) => option.value !== walletType)
                    .map((option) => (<link_1.default href={`/user/wallet/${option.value}`} key={option.value}>
                    <Button_1.default key={option.value} color={option.color} variant={option.value === router.query.walletType
                        ? "solid"
                        : "outlined"}>
                      {option.label}
                    </Button_1.default>
                  </link_1.default>))}
            </div>}/>)}
    </Default_1.default>);
};
exports.default = WalletDashboard;
