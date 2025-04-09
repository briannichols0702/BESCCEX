"use client";
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
exports.getServerSideProps = void 0;
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const api_1 = require("@/utils/api");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const date_fns_1 = require("date-fns");
const market_1 = require("@/utils/market");
const lodash_1 = require("lodash");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const next_i18next_1 = require("next-i18next");
const Errors_1 = require("@/components/ui/Errors");
const calculateCountdown = (startDate, endDate) => {
    const now = new Date();
    const start = (0, date_fns_1.parseISO)(startDate);
    const end = (0, date_fns_1.parseISO)(endDate);
    const isStarted = now >= start;
    const targetDate = isStarted ? end : start;
    let timeRemaining = (0, date_fns_1.differenceInSeconds)(targetDate, now);
    const totalDuration = (0, date_fns_1.differenceInSeconds)(end, start);
    if (timeRemaining < 0) {
        timeRemaining = 0;
    }
    const progress = isStarted
        ? ((totalDuration - timeRemaining) / totalDuration) * 100
        : 0;
    const days = Math.floor(timeRemaining / (60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds = timeRemaining % 60;
    return { days, hours, minutes, seconds, isStarted, progress };
};
const TokenInitialOfferingDashboard = ({ project = {}, tokens = [], error, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    if (error) {
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/ico" linkTitle={t("Back to ICO Dashboard")}/>);
    }
    const filteredTokens = tokens.filter((token) => token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.currency.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    return (<Default_1.default title={`${(0, lodash_1.capitalize)(project.name)} Project`} color="muted">
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">
            {(0, lodash_1.capitalize)(project.name)} {t("Project")}
          </span>{" "}
          <span className="text-muted-800 dark:text-muted-200">
            {t("Offerings")}
          </span>
        </h2>

        <div className="flex gap-2 w-full sm:max-w-xs text-end">
          <Input_1.default type="text" placeholder={t("Search Offerings...")} value={searchTerm} onChange={handleSearchChange} icon={"mdi:magnify"}/>
          <BackButton_1.BackButton href={`/ico`}/>
        </div>
      </div>

      <div className="relative my-5">
        <hr className="border-muted-200 dark:border-muted-700"/>
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm ? `Matching "${searchTerm}"` : `All Offers`}
          </span>
        </span>
      </div>
      {filteredTokens.length > 0 ? (<div className="flex flex-col gap-6">
          {filteredTokens.map((token) => {
                var _a, _b, _c, _d;
                const activePhase = (_a = token.phases) === null || _a === void 0 ? void 0 : _a.find((phase) => phase.status === "ACTIVE");
                const countdown = activePhase
                    ? calculateCountdown(activePhase.startDate, activePhase.endDate)
                    : null;
                return (<Card_1.default key={token.id} color="contrast" className="flex flex-col overflow-hidden font-sans sm:mx-0 sm:w-auto sm:flex-row">
                <div className="w-full bg-muted-200 px-8 py-6 dark:bg-muted-800 sm:w-1/3 flex flex-col justify-between">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-wider text-muted-500 dark:text-muted-400 sm:mb-3">
                      {token.chain}
                    </p>
                    <h3 className="text-xl capitalize text-muted-800 dark:text-muted-100">
                      {token.currency}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar_1.default src={token.image} size="xxs"/>
                    <div className="font-sans leading-none">
                      <p className="text-sm text-muted-800 dark:text-muted-100">
                        {token.name}
                      </p>
                      <p className="text-xs text-muted-400">
                        {(0, market_1.formatLargeNumber)(token.totalSupply)}{" "}
                        {t("Total Supply")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="right flex w-full flex-col justify-between px-8 py-6 sm:w-2/3">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-500 dark:text-muted-400 sm:-mt-3 sm:mb-0">
                        {(_b = activePhase === null || activePhase === void 0 ? void 0 : activePhase.name) !== null && _b !== void 0 ? _b : "N/A"} {t("Phase")}
                      </p>
                      <div className="w-full sm:w-64 md:w-96">
                        <Progress_1.default size="xs" color="success" value={(_c = activePhase === null || activePhase === void 0 ? void 0 : activePhase.contributionPercentage) !== null && _c !== void 0 ? _c : 0}/>
                        <div className="flex justify-between mt-1 w-full text-xs text-muted-500 dark:text-muted-400">
                          <p>
                            {(_d = activePhase === null || activePhase === void 0 ? void 0 : activePhase.totalContributions) !== null && _d !== void 0 ? _d : 0}{" "}
                            {t("Contributions")}
                          </p>
                          <p>
                            {(activePhase === null || activePhase === void 0 ? void 0 : activePhase.contributionAmount) || 0}{" "}
                            {token.purchaseCurrency}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="mt-1 text-md font-medium capitalize text-muted-800 dark:text-muted-100">
                        {token.description.length > 100
                        ? token.description.slice(0, 100) + "..."
                        : token.description}
                      </h3>
                      <ButtonLink_1.default href={`/ico/offer/${token.id}`} shape="rounded-sm" size="sm" color="primary">
                        {t("View Offering")}
                      </ButtonLink_1.default>
                    </div>
                  </div>

                  {countdown && (<div className="mt-6 w-full">
                      <Progress_1.default size="xs" color="primary" value={countdown.progress}/>
                      <div className="flex justify-between mt-1 w-full text-xs text-muted-500 dark:text-muted-400">
                        <p>{countdown.isStarted ? "Ends in" : "Starts in"}</p>
                        <p>
                          {countdown.days}d {countdown.hours}h{" "}
                          {countdown.minutes}m {countdown.seconds}s
                        </p>
                      </div>
                    </div>)}
                </div>
              </Card_1.default>);
            })}
        </div>) : (<div className="flex flex-col items-center justify-center gap-5 py-12">
          <h2 className="text-lg text-muted-800 dark:text-muted-200">
            {t("No Tokens Found")}
          </h2>
          <p className="text-muted-500 dark:text-muted-400 text-sm">
            {t("We couldn't find any of the tokens you are looking for.")}
          </p>
        </div>)}
    </Default_1.default>);
};
async function getServerSideProps(context) {
    try {
        const { id } = context.params;
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/ext/ico/project/${id}`,
        });
        if (error || !data) {
            return {
                props: {
                    error: error || "Unable to fetch ICO project details.",
                },
            };
        }
        const { tokens, ...project } = data;
        return {
            props: {
                project,
                tokens,
            },
        };
    }
    catch (error) {
        console.error("Error fetching ICO project details:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = TokenInitialOfferingDashboard;
