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
const react_1 = __importStar(require("react"));
const dashboard_1 = require("@/stores/dashboard");
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const HeaderCardImage_1 = require("@/components/widgets/HeaderCardImage");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const link_1 = __importDefault(require("next/link"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const react_2 = require("@iconify/react");
const datatable_1 = require("@/components/elements/base/datatable");
const constants_1 = require("@/utils/constants");
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
const imagePortal_1 = __importDefault(require("@/components/elements/imagePortal"));
const sonner_1 = require("sonner");
const api = "/api/ext/forex/transaction";
const columnConfig = [
    {
        field: "createdAt",
        label: "Date",
        type: "datetime",
        sortable: true,
        filterable: false,
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        options: [
            {
                value: "FOREX_DEPOSIT",
                label: "Deposit",
                color: "success",
            },
            {
                value: "FOREX_WITHDRAW",
                label: "Withdrawal",
                color: "danger",
            },
        ],
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
        sortable: true,
        options: constants_1.statusOptions,
    },
];
const ImageItem = ({ label, src, openLightbox }) => (<div>
    <div className="relative group">
      <a onClick={() => openLightbox(src)} className="block cursor-pointer">
        <img loading="lazy" src={src || "/img/placeholder.svg"} alt={label} className="rounded-lg" height="180"/>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <react_2.Icon icon="akar-icons:eye" className="text-white text-3xl"/>
        </div>
      </a>
    </div>
  </div>);
const ForexAccountsDashboard = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [accounts, setAccounts] = (0, react_1.useState)({});
    const [singals, setSignals] = (0, react_1.useState)([]);
    const [demoPasswordUnlocked, setDemoPasswordUnlocked] = (0, react_1.useState)(false);
    const [livePasswordUnlocked, setLivePasswordUnlocked] = (0, react_1.useState)(false);
    const [currentImage, setCurrentImage] = (0, react_1.useState)(null);
    const [isLightboxOpen, setIsLightboxOpen] = (0, react_1.useState)(false);
    const openLightbox = (image) => {
        setCurrentImage(image);
        setIsLightboxOpen(true);
    };
    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };
    const fetchForexAccounts = async () => {
        const url = "/api/ext/forex/account";
        const { data, error } = await (0, api_1.default)({
            url,
            silent: true,
        });
        if (!error) {
            setAccounts(data);
            if (data["LIVE"] && data["LIVE"].accountSignals) {
                setSignals(data["LIVE"].accountSignals);
            }
        }
    };
    const debounceFetchForexAccounts = (0, lodash_1.debounce)(fetchForexAccounts, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            debounceFetchForexAccounts();
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (router.isReady &&
            getSetting("forexRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to access forex accounts"));
        }
    }, [router.isReady, (_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status]);
    return (<Default_1.default title={t("Forex Accounts")} color="muted">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
        <div className="col-span-12 lg:col-span-8 ltablet:col-span-8">
          <HeaderCardImage_1.HeaderCardImage title={t("Forex")} description={getSetting("forexInvestment") === "true"
            ? "Choose from a variety of investment plans to grow your wealth."
            : "Trade forex with ease and confidence."} lottie={{
            category: "stock-market-2",
            path: "capital-funding",
            max: 2,
            height: getSetting("forexInvestment") === "true" ? 220 : 200,
        }} link={getSetting("forexInvestment") === "true"
            ? `/user/invest/forex/plan`
            : undefined} linkLabel="View Investment Plans" size="md"/>

          <div className="mt-3">
            <datatable_1.DataTable title={t("Transactions")} postTitle={t("Forex")} endpoint={api} columnConfig={columnConfig} isCrud={false} hasStructure={false} paginationLocation="static" hasRotatingBackButton={false} hasBreadcrumb={false}/>
          </div>
          {singals && singals.length > 0 && (<div className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl text-muted-800 dark:text-muted-200">
                  {t("Signals")}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
                {singals.map((signal, index) => (<Card_1.default key={index} className="relative text-md col-span-4" color={"contrast"}>
                    <ImageItem label={signal.title} src={signal.image} openLightbox={openLightbox}/>
                  </Card_1.default>))}
              </div>
            </div>)}
        </div>
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-4 ltablet:col-span-4 mt-0 md:mt-6">
          {Object.values(accounts).map((account, index) => (<Card_1.default key={index} className="relative text-md" color={"contrast"}>
              {!account.accountId && (<div className="absolute h-full w-full bg-white bg-opacity-50 backdrop-blur-xs z-10 rounded-lg dark:bg-black dark:bg-opacity-50">
                  <div className="flex items-center justify-center h-full flex-col">
                    <react_2.Icon icon="svg-spinners:blocks-shuffle-3" className="h-10 w-10 text-info-500"/>
                    <span className="text-muted-500 text-sm mt-2">
                      {t("Account not ready yet")}
                    </span>
                  </div>
                </div>)}
              <div className="w-full h-full p-5">
                <div className="mb-5">
                  <link_1.default href={`/user/forex/${account.id}`}>
                    <Button_1.default disabled={!account.status || account.balance === 0} type="button" color="primary" shape="rounded-sm" className="w-full">
                      {account.type} {t("Trade")}
                    </Button_1.default>
                  </link_1.default>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("Account ID")}</span>
                  <span className="text-muted-800 dark:text-muted-100">
                    {account.accountId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("Password")}</span>
                  <span className="flex items-center gap-2 text-muted-800 dark:text-muted-100">
                    <span>
                      {account.type === "DEMO"
                ? !demoPasswordUnlocked
                    ? "*********"
                    : account.password
                : account.type === "LIVE"
                    ? !livePasswordUnlocked
                        ? "*********"
                        : account.password
                    : "N/A"}
                    </span>
                    <react_2.Icon className="cursor-pointer" icon={account.type === "DEMO"
                ? demoPasswordUnlocked
                    ? "bi:eye"
                    : "bi:eye-slash"
                : livePasswordUnlocked
                    ? "bi:eye"
                    : "bi:eye-slash"} onClick={() => {
                if (account.type === "DEMO") {
                    setDemoPasswordUnlocked(!demoPasswordUnlocked);
                }
                else if (account.type === "LIVE") {
                    setLivePasswordUnlocked(!livePasswordUnlocked);
                }
            }}/>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("Leverage")}</span>
                  <span className="text-muted-800 dark:text-muted-100">
                    x{account.leverage}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("MetaTrader")}</span>
                  <span className="text-muted-800 dark:text-muted-100">
                    {account.mt}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("Balance")}</span>
                  <span className="text-muted-800 dark:text-muted-100">
                    {account.balance}
                  </span>
                </div>
                {account.type === "LIVE" && (<div className="flex gap-5 items-center justify-center mt-5">
                    <a href={`/user/forex/${account.id}/deposit`} className="w-full">
                      <Button_1.default type="button" color="success" shape="rounded-sm" className="w-full" disabled={!account.status}>
                        <span>{t("Deposit")}</span>
                      </Button_1.default>
                    </a>
                    <a href={`/user/forex/${account.id}/withdraw`} className="w-full">
                      <Button_1.default type="button" color="danger" shape="rounded-sm" className="w-full" disabled={!account.status || account.balance === 0}>
                        <span>{t("Withdraw")}</span>
                      </Button_1.default>
                    </a>
                  </div>)}
              </div>
            </Card_1.default>))}
        </div>
      </div>

      <Faq_1.Faq category="FOREX"/>
      {isLightboxOpen && (<imagePortal_1.default src={currentImage} onClose={closeLightbox}/>)}
    </Default_1.default>);
};
exports.default = ForexAccountsDashboard;
