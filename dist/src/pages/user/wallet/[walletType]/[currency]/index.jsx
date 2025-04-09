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
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const constants_1 = require("@/utils/constants");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const dashboard_1 = require("@/stores/dashboard");
const sonner_1 = require("sonner");
const api = "/api/finance/transaction";
const columnConfig = [
    {
        field: "id",
        label: "ID",
        type: "text",
        sortable: true,
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        options: constants_1.transactionTypeOptions,
        sortable: true,
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        precision: 8,
        sortable: true,
    },
    {
        field: "fee",
        label: "Fee",
        type: "number",
        precision: 8,
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: constants_1.statusOptions,
        sortable: true,
    },
    {
        field: "createdAt",
        label: "Date",
        type: "date",
        sortable: true,
        filterable: false,
        getValue: (item) => new Date(item.createdAt).toLocaleString(),
    },
];
const WalletTransactions = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (router.isReady &&
            getSetting("walletRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to access wallet transactions"));
        }
    }, [router.isReady, (_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status]);
    const { walletType, currency } = router.query;
    if (!walletType || !currency) {
        return null;
    }
    return (<Default_1.default title={t("Transactions")} color="muted">
      <datatable_1.DataTable title={t("Transactions")} postTitle={currency} endpoint={api} columnConfig={columnConfig} canCreate={false} canEdit={false} canDelete={false} hasAnalytics params={{ walletType, currency }} navSlot={<>
            <BackButton_1.BackButton href={`/user/wallet`}/>
          </>}/>
    </Default_1.default>);
};
exports.default = WalletTransactions;
