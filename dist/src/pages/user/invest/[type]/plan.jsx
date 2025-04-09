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
const router_1 = require("next/router");
const lodash_1 = require("lodash");
const api_1 = __importDefault(require("@/utils/api"));
const MashImage_1 = require("@/components/elements/MashImage");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const HeaderCardImage_1 = require("@/components/widgets/HeaderCardImage");
const next_i18next_1 = require("next-i18next");
const link_1 = __importDefault(require("next/link"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const InvestmentPlansDashboard = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { type } = router.query;
    const Type = (0, lodash_1.capitalize)(type);
    const [plans, setPlans] = (0, react_1.useState)([]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const fetchInvestmentPlans = async () => {
        if (!type)
            return;
        let url;
        switch (type.toLowerCase()) {
            case "general":
                url = "/api/finance/investment/plan";
                break;
            case "ai":
                url = "/api/ext/ai/investment/plan";
                break;
            case "forex":
                url = "/api/ext/forex/investment/plan";
                break;
            default:
                break;
        }
        const { data, error } = await (0, api_1.default)({
            url,
            silent: true,
        });
        if (!error) {
            setPlans(data);
        }
    };
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchInvestmentPlans();
        }
    }, [type, router.isReady]);
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredPlans = plans.filter((plan) => plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.currency.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<Default_1.default title={`${Type} Investment Plans`} color="muted">
      <div className="mb-6">
        <HeaderCardImage_1.HeaderCardImage title={`Welcome to our ${Type} Investment Plans`} description={`Here you can find a list of all available investment plans that are currently active and open for new investments.`} link={`/user/invest/${type}`} linkLabel="View Your Investments" lottie={{
            category: type === "forex" ? "stock-market" : "cryptocurrency-2",
            path: type === "forex" ? "stock-market-monitoring" : "analysis-1",
            max: type === "forex" ? 2 : undefined,
            height: 240,
        }} size="lg"/>
      </div>

      <div className="w-full flex items-center justify-between mb-6">
        <div className="w-full hidden sm:block">
          <h2 className="text-2xl">
            <span className="text-primary-500">{t("Popular")} </span>
            <span className="text-muted-800 dark:text-muted-200">
              {t("Investment Plans")}
            </span>
          </h2>
        </div>

        <div className="w-full sm:max-w-xs text-end">
          <Input_1.default type="text" placeholder={t("Search Investment Plans")} value={searchTerm} onChange={handleSearchChange} icon={"mdi:magnify"}/>
        </div>
      </div>

      <div className="relative mb-5">
        <hr className="border-muted-200 dark:border-muted-700"/>
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm
            ? `Matching "${searchTerm}"`
            : `All ${Type} Investment Plans`}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto md:auto-rows-[18rem]">
        {filteredPlans.map((plan) => (<link_1.default key={plan.id} href={`/user/invest/${type}/${plan.id}`}>
            <Card_1.default className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400" color="contrast">
              <div className="relative w-full h-[200px]">
                <MashImage_1.MashImage src={plan.image} alt={plan.title} className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900" fill/>
                {plan.trending && (<div className="absolute top-0 right-1">
                    <Tag_1.default color="primary" className="rounded-sm">
                      {t("Trending")}
                    </Tag_1.default>
                  </div>)}
              </div>

              <div className="p-2">
                <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-400">
                  {plan.title}
                </h3>
                <div className="flex flex-col gap-1">
                  <p className="pb-2 text-muted-500 dark:text-muted-400 text-sm">
                    {plan.description.length > 100
                ? plan.description.slice(0, 100) + "..."
                : plan.description}
                  </p>
                  <div className="flex justify-between text-xs text-muted-500 dark:text-muted-400">
                    <p>{t("Return of Investment")}</p>
                    <p className="text-success-500">{plan.profitPercentage}%</p>
                  </div>
                </div>
              </div>
            </Card_1.default>
          </link_1.default>))}
      </div>
    </Default_1.default>);
};
exports.default = InvestmentPlansDashboard;
