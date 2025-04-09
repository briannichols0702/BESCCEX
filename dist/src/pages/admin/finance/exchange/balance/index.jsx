"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
const object_table_1 = require("@/components/elements/base/object-table");
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const api = "/api/admin/finance/exchange/balance";
const columnConfig = [
    {
        field: "asset",
        label: "Asset",
        type: "string",
        sortable: true,
    },
    {
        field: "available",
        label: "Available Balance",
        type: "number",
        precision: 8,
        sortable: true,
    },
    {
        field: "inOrder",
        label: "In Order Balance",
        type: "number",
        precision: 8,
        sortable: true,
    },
    {
        field: "total",
        label: "Total Balance",
        type: "number",
        precision: 8,
        sortable: true,
    },
];
const ExchangeBalanceDashboard = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const [balances, setBalances] = (0, react_1.useState)([]);
    const fetchExchangeBalance = async () => {
        const { data, error } = await (0, api_1.default)({
            url: api,
            silent: true,
        });
        if (!error) {
            setBalances(data.balance);
        }
    };
    const debounceFetchExchangeBalance = (0, lodash_1.debounce)(fetchExchangeBalance, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            debounceFetchExchangeBalance();
        }
    }, [router.isReady]);
    return (<Default_1.default title={t("Exchange Balance")} color="muted">
      <object_table_1.ObjectTable title={t("Exchange Balance")} items={balances} setItems={setBalances} columnConfig={columnConfig} navSlot={<IconBox_1.default color="primary" onClick={() => fetchExchangeBalance()} size={"sm"} shape={"rounded-sm"} variant={"pastel"} className="cursor-pointer hover:shadow-sm transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-primary-500 hover:text-muted-100" icon="mdi:refresh"/>} shape="rounded-sm" size="sm" filterField="asset" initialPerPage={20}/>
    </Default_1.default>);
};
exports.default = ExchangeBalanceDashboard;
exports.permission = "Access Exchange Balance Management";
