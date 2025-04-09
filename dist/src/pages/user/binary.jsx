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
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const react_2 = require("@iconify/react");
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
const next_i18next_1 = require("next-i18next");
const BinaryList_1 = __importDefault(require("@/components/pages/binary/BinaryList"));
const sonner_1 = require("sonner");
const lodash_1 = require("lodash");
const market_1 = __importDefault(require("@/stores/trade/market"));
const HeaderCardImage_1 = require("@/components/widgets/HeaderCardImage");
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const binaryPractice = process.env.NEXT_PUBLIC_BINARY_PRACTICE_STATUS !== "false";
const BinaryTradingDashboard = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [livePositions, setLivePositions] = (0, react_1.useState)([]);
    const [practicePositions, setPracticePositions] = (0, react_1.useState)([]);
    const [livePercentageChange, setLivePercentageChange] = (0, react_1.useState)(0);
    const [practicePercentageChange, setPracticePercentageChange] = (0, react_1.useState)(0);
    const [firstAvailableMarket, setFirstAvailableMarket] = (0, react_1.useState)(null);
    const { getFirstAvailablePair, fetchData, marketData } = (0, market_1.default)();
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (router.isReady &&
            getSetting("binaryRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to access forex accounts"));
        }
    }, [router.isReady, (_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status]);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchBinaryPositions();
            (0, lodash_1.debounce)(fetchData, 100)();
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        const availableMarket = getFirstAvailablePair();
        setFirstAvailableMarket(availableMarket);
    }, [marketData.length]);
    const fetchBinaryPositions = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/exchange/binary/order/last",
            silent: true,
        });
        if (!error) {
            setLivePositions(data.nonPracticeOrders);
            setPracticePositions(data.practiceOrders);
            setLivePercentageChange(data.livePercentageChange);
            setPracticePercentageChange(data.practicePercentageChange);
        }
    };
    const LivePositionsMonthCount = livePositions.filter((item) => new Date(item.createdAt).getTime() >
        new Date(new Date().setDate(new Date().getDate() - 30)).getTime());
    const PracticePositionsMonthCount = practicePositions.filter((item) => new Date(item.createdAt).getTime() >
        new Date(new Date().setDate(new Date().getDate() - 30)).getTime());
    return (<Default_1.default title={t("Binary Trading")} color="muted">
      <HeaderSection t={t} binaryPractice={binaryPractice} firstAvailableMarket={firstAvailableMarket}/>
      <PositionsSection t={t} livePositions={livePositions} practicePositions={practicePositions} livePercentageChange={livePercentageChange} practicePercentageChange={practicePercentageChange} LivePositionsMonthCount={LivePositionsMonthCount} PracticePositionsMonthCount={PracticePositionsMonthCount} binaryPractice={binaryPractice}/>
      <Faq_1.Faq category="BINARY"/>
    </Default_1.default>);
};
const HeaderSection = ({ t, binaryPractice, firstAvailableMarket }) => (<HeaderCardImage_1.HeaderCardImage title={t("Binary Trading")} description={binaryPractice
        ? "Practice your trading skills with a Practice account or start trading with a live account."
        : "Start trading with a live account."} lottie={{ category: "cryptocurrency-2", path: "trading", height: 240 }} size="lg" linkElement={<>
        {firstAvailableMarket ? (<>
            {binaryPractice && (<ButtonLink_1.default href={`/binary/${firstAvailableMarket}?practice=true`} color="primary" shape="rounded-sm" className="text-white dark:text-muted-100" variant={"outlined"}>
                {t("Practice")}
              </ButtonLink_1.default>)}
            <ButtonLink_1.default href={`/binary/${firstAvailableMarket}`} color="contrast" shape="rounded-sm">
              {t("Start Trading")}
            </ButtonLink_1.default>
          </>) : (<Button_1.default color="primary" shape="rounded-sm">
            {t("Coming Soon")}
          </Button_1.default>)}
      </>}/>);
const PositionsSection = ({ t, livePositions, practicePositions, livePercentageChange, practicePercentageChange, LivePositionsMonthCount, PracticePositionsMonthCount, binaryPractice, }) => (<div className="flex flex-col md:flex-row gap-8 w-full mt-16">
    <div className="flex flex-col gap-5 w-full md:w-1/2">
      <PositionCard title={t("Live Positions (30 days)")} positions={livePositions} percentageChange={livePercentageChange} count={LivePositionsMonthCount.length} imgSrc="/img/illustrations/apex.svg"/>
    </div>
    <div className="flex flex-col gap-5 w-full md:w-1/2">
      {binaryPractice && (<PositionCard title={t("Practice Positions (30 days)")} positions={practicePositions} percentageChange={practicePercentageChange} count={PracticePositionsMonthCount.length} imgSrc="/img/illustrations/laptop-woman.svg"/>)}
    </div>
  </div>);
const PositionCard = ({ title, positions, percentageChange, count, imgSrc, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Card_1.default className="p-6" color={"contrast"}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-500 dark:text-muted-400 text-md">{title}</p>
          <div className="pb-6 pt-4">
            <span className="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none">
              <span className="mr-2">{count}</span>
              <small className="text-muted-500 dark:text-muted-400 text-sm font-medium">
                {t("positions")}
              </small>
            </span>
          </div>
          <div className="mb-2 flex items-center gap-2 font-sans">
            {Number(percentageChange) === 0 ? (<span className="text-muted-400 text-sm">
                {t("No records from last month")}
              </span>) : (<div className={`flex items-center font-semibold ${percentageChange > 0 ? "text-green-500" : "text-red-500"}`}>
                <react_2.Icon icon={percentageChange > 0
                ? "ri:arrow-up-s-fill"
                : "ri:arrow-down-s-fill"} className="h-4 w-4 text-current"/>
                <span>{percentageChange.toFixed(2)}%</span>
                <span className="text-muted-400 text-sm ml-2">
                  {percentageChange > 0
                ? t("more than last month")
                : t("less than last month")}
                </span>
              </div>)}
          </div>
        </div>
        <span className="xs:hidden sm:absolute -right-4 -top-10">
          <img src={imgSrc} className="h-48" alt={title}/>
        </span>
      </div>
      <BinaryList_1.default shape="full" positions={positions}/>
    </Card_1.default>);
};
exports.default = BinaryTradingDashboard;
