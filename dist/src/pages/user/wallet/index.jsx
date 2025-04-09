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
const Default_1 = __importDefault(require("@/layouts/Default"));
const framer_motion_1 = require("framer-motion");
const react_1 = __importStar(require("react"));
const wallet_1 = require("@/stores/user/wallet");
const router_1 = require("next/router");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const react_2 = require("@iconify/react");
const WalletChart_1 = require("@/components/charts/WalletChart");
const datatable_1 = require("@/components/elements/base/datatable");
const dashboard_1 = require("@/stores/dashboard");
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
require("react-loading-skeleton/dist/skeleton.css");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const link_1 = __importDefault(require("next/link"));
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
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
    {
        field: "type",
        label: "Type",
        type: "select",
        sortable: true,
        options: [
            { value: "FIAT", label: "Fiat", color: "warning" },
            { value: "SPOT", label: "Spot", color: "info" },
            { value: "ECO", label: "Funding", color: "primary" },
            { value: "FUTURES", label: "Futures", color: "success" },
        ],
    },
];
const WalletDashboard = () => {
    var _a;
    const [loading, setLoading] = (0, react_1.useState)(false);
    const { t } = (0, next_i18next_1.useTranslation)();
    const { pnl, fetchPnl } = (0, wallet_1.useWalletStore)();
    const router = (0, router_1.useRouter)();
    const [togglePnl, setTogglePnl] = (0, react_1.useState)(false);
    const { isDark, settings } = (0, dashboard_1.useDashboardStore)();
    const debounceFetchPnl = (0, lodash_1.debounce)(fetchPnl, 100);
    (0, react_1.useEffect)(() => {
        if (!router.isReady)
            return;
        debounceFetchPnl();
        setLoading(false);
    }, [router.isReady]);
    const deposit = (settings === null || settings === void 0 ? void 0 : settings.deposit) !== "false";
    const withdraw = (settings === null || settings === void 0 ? void 0 : settings.withdraw) !== "false";
    const transfer = (settings === null || settings === void 0 ? void 0 : settings.transfer) !== "false";
    return (<Default_1.default title={t("Wallets Dashboard")} color="muted">
      <Card_1.default className="mb-2 p-4 relative" color={"mutedContrast"}>
        <div className="flex justify-between items-start sm:items-center px-4 flex-col sm:flex-row gap-5 mb-6 sm:mb-0">
          <h1 className="font-sans text-xl font-light uppercase tracking-wide text-muted-800 dark:text-muted-200">
            {t("Estimated Balance")}
          </h1>
          <div className="flex justify-between items-center gap-10 w-full sm:w-auto">
            <div>
              <p className="text-lg font-semibold text-muted-800 dark:text-muted-200">
                {(pnl === null || pnl === void 0 ? void 0 : pnl.today) ? (`$${(_a = pnl.today) === null || _a === void 0 ? void 0 : _a.toFixed(2)}`) : loading ? (<react_loading_skeleton_1.default width={60} height={12} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>) : ("$0.00")}
              </p>
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {t("Total Balance")}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-muted-800 dark:text-muted-200">
                {(pnl === null || pnl === void 0 ? void 0 : pnl.today) ? (<>
                    {pnl.today > pnl.yesterday && pnl.yesterday !== 0 ? (<span className="flex items-center gap-2 text-green-500">
                        <span>+${(pnl.today - pnl.yesterday).toFixed(2)}</span>
                        <span className="text-md">
                          (+
                          {pnl.yesterday !== 0
                    ? (((pnl.today - pnl.yesterday) / pnl.yesterday) *
                        100).toFixed(2)
                    : "0"}
                          %)
                        </span>
                      </span>) : pnl.today < pnl.yesterday ? (<span className="flex items-center gap-2 text-red-500">
                        <span>-${(pnl.yesterday - pnl.today).toFixed(2)}</span>
                        <span className="text-md">
                          (-
                          {pnl.yesterday !== 0
                    ? (((pnl.yesterday - pnl.today) / pnl.yesterday) *
                        100).toFixed(2)
                    : 0}
                          %)
                        </span>
                      </span>) : (<span className="flex items-center gap-2 text-gray-500">
                        <span>$0.00</span>
                        <span className="text-md">(0.00%)</span>
                      </span>)}
                  </>) : loading ? (<react_loading_skeleton_1.default width={60} height={12} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>) : ("$0.00")}
              </p>
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {t("Today's PnL")}
              </p>
            </div>
          </div>
          <div onClick={() => setTogglePnl(!togglePnl)} className="absolute bottom-0 left-[50%] border-t border-x bg-muted-50 dark:bg-muted-900 hover:bg-muted-200 dark:hover:bg-muted-950 text-muted-400 dark:text-muted-400 hover:text-muted-600 dark:hover:text-muted-300 cursor-pointer border-muted-200 dark:border-muted-700 transform -translate-x-1/2 w-12 flex items-center justify-center rounded-t-md">
            <react_2.Icon icon={togglePnl ? "mdi:chevron-up" : "mdi:chevron-down"} className="h-6 w-6"/>
          </div>
        </div>
        <framer_motion_1.AnimatePresence>
          {togglePnl && (pnl === null || pnl === void 0 ? void 0 : pnl.chart) && pnl.chart.length > 0 && (<framer_motion_1.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5 }}>
              <WalletChart_1.WalletChart data={pnl.chart}/>
            </framer_motion_1.motion.div>)}
        </framer_motion_1.AnimatePresence>
      </Card_1.default>

      <datatable_1.DataTable title={t("Wallets")} postTitle="" endpoint={api} columnConfig={columnConfig} hasStructure={false} canDelete={false} canEdit={false} canCreate={false} viewPath="/user/wallet/[type]/[currency]" blank={false} isParanoid={false} navSlot={<div className="flex gap-2">
            {deposit && (<link_1.default href="/user/wallet/deposit">
                <Button_1.default color="primary" variant="outlined" shape={"rounded-sm"}>
                  {t("Deposit")}
                </Button_1.default>
              </link_1.default>)}
            {withdraw && (<link_1.default href="/user/wallet/withdraw">
                <Button_1.default color="warning" variant="outlined" shape={"rounded-sm"}>
                  {t("Withdraw")}
                </Button_1.default>
              </link_1.default>)}
            {transfer && (<link_1.default href="/user/wallet/transfer">
                <Button_1.default color="info" variant="outlined" shape={"rounded-sm"}>
                  {t("Transfer")}
                </Button_1.default>
              </link_1.default>)}
          </div>}/>
    </Default_1.default>);
};
exports.default = WalletDashboard;
