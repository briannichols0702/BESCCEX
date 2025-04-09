"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importDefault(require("react"));
const dashboard_1 = require("@/stores/dashboard");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const MashImage_1 = require("@/components/elements/MashImage");
const next_i18next_1 = require("next-i18next");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const api_1 = require("@/utils/api");
const Errors_1 = require("@/components/ui/Errors");
const AffiliateDashboard = ({ conditions, error }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    if (error) {
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/user/affiliate" linkTitle={t("Back to Affiliate Dashboard")}/>);
    }
    return (<Default_1.default title={t("Affiliate")} color="muted">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">
            <span className="text-primary-500">{t("Affiliate")}</span>{" "}
            <span className="text-muted-800 dark:text-muted-200">
              {t("Program")}
            </span>
          </h2>
          <p className="font-sans text-base text-muted-500 dark:text-muted-400">
            {t("Welcome to the affiliate program")} {profile === null || profile === void 0 ? void 0 : profile.firstName}.
            {t("Here are the conditions for earning rewards.")}.
          </p>
        </div>
        <BackButton_1.BackButton href="/user/affiliate"/>
      </div>
      <div className="flex justify-center items-center text-center w-full">
        <div className="w-full max-w-lg">
          <MashImage_1.MashImage src="/img/ui/referral-program.svg" alt="mlm-program" width={300} height={300} className="w-full"/>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {conditions.map((condition, index) => (<Card_1.default key={index} shape="smooth" color="contrast" className="group relative overflow-hidden p-5">
            <div className="flex items-center gap-2">
              <div className="mask mask-hexed flex h-16 w-16 items-center justify-center bg-muted-100 transition-colors duration-300 group-hover:bg-primary-500 dark:bg-muted-900 dark:group-hover:bg-primary-500">
                <div className="mask mask-hexed relative flex h-16 w-16 scale-95 items-center justify-center bg-white dark:bg-muted-950 text-muted-800 dark:text-muted-200">
                  {index + 1}
                </div>
              </div>
              <h4 className="font-sans text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                {condition.title}
              </h4>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-500">{condition.description}</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-sans text-md text-muted-400">
                {t("Reward")}
              </span>
              <span className="font-sans text-md text-success-500 border border-success-500 rounded-md px-3 py-1">
                {condition.reward}{" "}
                {condition.rewardType === "PERCENTAGE"
                ? "%"
                : ` ${condition.rewardCurrency}`}
              </span>
            </div>
          </Card_1.default>))}
      </div>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    try {
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/ext/affiliate/condition`,
        });
        if (error || !data) {
            return {
                props: {
                    error: error || "Unable to fetch affiliate conditions.",
                },
            };
        }
        return {
            props: {
                conditions: data,
            },
        };
    }
    catch (error) {
        console.error("Error fetching affiliate conditions:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = AffiliateDashboard;
