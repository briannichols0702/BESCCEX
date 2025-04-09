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
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const api_1 = __importStar(require("@/utils/api"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const react_2 = require("@iconify/react");
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const date_fns_1 = require("date-fns");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const MashImage_1 = require("@/components/elements/MashImage");
const market_1 = require("@/utils/market");
const link_1 = __importDefault(require("next/link"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const wallet_1 = require("@/stores/user/wallet");
const next_i18next_1 = require("next-i18next");
const sonner_1 = require("sonner");
const Errors_1 = require("@/components/ui/Errors");
const Default_2 = __importDefault(require("@/components/elements/addons/Countdown/Default"));
const OfferDetails = ({ token: initialToken, error }) => {
    var _a, _b, _c, _d, _e, _f;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [token, setToken] = (0, react_1.useState)(initialToken || null);
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const { wallet, fetchWallet } = (0, wallet_1.useWalletStore)();
    const [amount, setAmount] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (token &&
            (!wallet ||
                (wallet &&
                    wallet.type !== token.purchaseWalletType &&
                    wallet.currency !== token.purchaseCurrency))) {
            fetchWallet(token.purchaseWalletType, token.purchaseCurrency);
        }
    }, [token, wallet]);
    if (!token) {
        return (<Errors_1.NotFound title={t("Token Not Found")} description={t("We couldn't find the token details.")} link="/ico" linkTitle={t("Back to ICO Dashboard")}/>);
    }
    if (error) {
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/ico" linkTitle={t("Back to ICO Dashboard")}/>);
    }
    const activePhase = token.phases.find((phase) => phase.status === "ACTIVE");
    const fetchToken = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/ico/offer/${id}`,
            silent: true,
        });
        if (!error) {
            setToken(data);
        }
        else {
            sonner_1.toast.error(t("Failed to fetch token details."));
        }
    };
    const purchase = async () => {
        var _a, _b, _c;
        if (!activePhase)
            return;
        if (getSetting("icoRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            await router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to participate in ICO"));
            return;
        }
        const { error } = await (0, api_1.default)({
            url: `/api/ext/ico/contribution`,
            method: "POST",
            body: { amount, phaseId: activePhase.id },
        });
        if (!error) {
            fetchWallet(token.purchaseWalletType, token.purchaseCurrency);
            await fetchToken(); // Refetch token details to update UI
            setAmount(0);
        }
    };
    return (<Default_1.default title={`${token === null || token === void 0 ? void 0 : token.name} Details`} color="muted">
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{token === null || token === void 0 ? void 0 : token.name} </span>
          <span className="text-muted-800 dark:text-muted-200">
            {t("Details")}
          </span>
        </h2>

        <BackButton_1.BackButton href={`/ico/project/${token === null || token === void 0 ? void 0 : token.projectId}`}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        <div className="col-span-1 md:col-span-2 xl:col-span-3 space-y-5">
          <Card_1.default className="text-muted-800 dark:text-muted-200 flex flex-col items-center p-6 sm:flex-row" color="contrast">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <div className="relative">
                <Avatar_1.default src={token === null || token === void 0 ? void 0 : token.image} text={token === null || token === void 0 ? void 0 : token.currency} size="xl"/>
                {(token === null || token === void 0 ? void 0 : token.chain) && (<MashImage_1.MashImage src={`/img/crypto/${(_a = token.chain) === null || _a === void 0 ? void 0 : _a.toLowerCase()}.webp`} width={24} height={24} alt="chain" className="absolute right-0 bottom-0"/>)}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-sans text-base font-medium">
                  {token === null || token === void 0 ? void 0 : token.currency} ({token === null || token === void 0 ? void 0 : token.name})
                </h4>
                <p className="text-muted-400 font-sans text-sm">
                  {token === null || token === void 0 ? void 0 : token.description}
                </p>
              </div>
            </div>
          </Card_1.default>
          <Card_1.default color="contrast" className="text-muted-800 dark:text-muted-200 p-4 text-sm">
            <h3 className="text-start font-bold mb-2">{t("Token Details")}</h3>
            <ul className="flex flex-col gap-2">
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Name")}</strong> {token === null || token === void 0 ? void 0 : token.name}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Address")}</strong> {token === null || token === void 0 ? void 0 : token.address}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Project Name")}</strong> {token === null || token === void 0 ? void 0 : token.project.name}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Project Description")}</strong>{" "}
                {token === null || token === void 0 ? void 0 : token.project.description}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Project Website")}</strong>
                <a href={token === null || token === void 0 ? void 0 : token.project.website} target="_blank" rel="noopener noreferrer" className="text-primary-500">
                  {token === null || token === void 0 ? void 0 : token.project.website}
                </a>
              </li>
              <li className="border-b border-muted-200 dark:border-muted-800 flex justify-between">
                <strong>{t("Project Whitepaper")}</strong>
                <p>{token === null || token === void 0 ? void 0 : token.project.whitepaper}</p>
              </li>
              <li className="flex justify-between">
                <strong>{t("Total Supply")}</strong> {token === null || token === void 0 ? void 0 : token.totalSupply}{" "}
                {token === null || token === void 0 ? void 0 : token.currency}
              </li>
            </ul>
          </Card_1.default>
          {activePhase && (<Card_1.default color="contrast" className="text-muted-800 dark:text-muted-200 p-4 flex flex-col sm:flex-row justify-between text-sm">
              <div className="w-full">
                <h3 className="text-start font-bold mb-2">
                  {t("Active Phase Details")}
                </h3>
                <ul className="flex flex-col gap-2">
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-800">
                    <strong>{t("Price")}</strong>
                    <span>
                      {activePhase.price} {token === null || token === void 0 ? void 0 : token.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-800">
                    <strong>{t("Min Purchase Amount")}</strong>
                    <span>
                      {activePhase.minPurchase} {token === null || token === void 0 ? void 0 : token.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-800">
                    <strong>{t("Max Purchase Amount")}</strong>
                    <span>
                      {activePhase.maxPurchase} {token === null || token === void 0 ? void 0 : token.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-800">
                    <strong>{t("Start Date")}</strong>
                    <span>
                      {(0, date_fns_1.format)((0, date_fns_1.parseISO)(activePhase.startDate), "PPpp")}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <strong>{t("End Date")}</strong>
                    <span>{(0, date_fns_1.format)((0, date_fns_1.parseISO)(activePhase.endDate), "PPpp")}</span>
                  </li>
                </ul>
              </div>
            </Card_1.default>)}
        </div>
        <div className="space-y-5">
          <Card_1.default color="contrast" className="text-muted-800 dark:text-muted-200 space-y-5">
            <div className="w-full p-4 border-b text-center border-gray-200 dark:border-gray-700">
              <div className="w-full">
                {activePhase && (<Default_2.default startDate={activePhase.startDate} endDate={activePhase.endDate} onExpire={() => fetchToken()} // Optional: Refetch token or trigger an action when countdown ends
        />)}
              </div>
            </div>
            <div className="w-full grow space-y-1 px-4 pb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-muted-700 dark:text-muted-100 font-sans text-sm font-medium">
                  {t("Progress")}
                </h4>
                <div>
                  <span className="text-muted-400 font-sans text-sm">
                    {(_c = (_b = activePhase === null || activePhase === void 0 ? void 0 : activePhase.contributionPercentage) === null || _b === void 0 ? void 0 : _b.toFixed(6)) !== null && _c !== void 0 ? _c : 0}%
                  </span>
                </div>
              </div>
              <Progress_1.default size="xs" color="primary" value={(_d = activePhase === null || activePhase === void 0 ? void 0 : activePhase.contributionPercentage) !== null && _d !== void 0 ? _d : 0}/>
            </div>
            {activePhase && (<>
                <div className="border-t border-muted-200 dark:border-muted-800 pt-4 px-4">
                  <Input_1.default type="number" label={t("Amount")} placeholder={t("Enter amount")} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} min={activePhase.minPurchase} max={wallet
                ? wallet.balance > activePhase.maxPurchase
                    ? activePhase.maxPurchase
                    : wallet === null || wallet === void 0 ? void 0 : wallet.balance
                : activePhase.maxPurchase}/>
                </div>
                <div className="flex justify-between items-center text-xs pt-0 px-4">
                  <span className="text-muted-800 dark:text-muted-200">
                    {t("Balance")}
                  </span>
                  <span className="flex gap-1 justify-center items-center">
                    {(_e = wallet === null || wallet === void 0 ? void 0 : wallet.balance) !== null && _e !== void 0 ? _e : 0} {token === null || token === void 0 ? void 0 : token.purchaseCurrency}
                    <link_1.default href={`/user/wallet/deposit`}>
                      <react_2.Icon icon="ei:plus" className="h-5 w-5 text-success-500"/>
                    </link_1.default>
                  </span>
                </div>
                <div className="px-4 pb-4">
                  <Button_1.default type="button" shape="rounded-sm" color="primary" className="w-full" onClick={() => purchase()} disabled={!amount ||
                amount < activePhase.minPurchase ||
                amount > activePhase.maxPurchase ||
                (wallet ? amount > wallet.balance : false)}>
                    {t("Purchase")}
                  </Button_1.default>
                </div>
              </>)}
          </Card_1.default>

          <Card_1.default color="contrast" className="text-muted-800 dark:text-muted-200 ">
            <div className="w-full">
              <div className="flex flex-col gap-1 text-center border-b border-muted-200 dark:border-muted-800 p-4">
                <h3 className="font-sans text-md font-semibold">
                  {activePhase === null || activePhase === void 0 ? void 0 : activePhase.name}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Phase")}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-b border-muted-200 dark:border-muted-800 p-4 text-center">
                <h3 className="font-sans text-md font-semibold">
                  {(0, market_1.formatLargeNumber)((token === null || token === void 0 ? void 0 : token.saleAmount) || 0)}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Sale Amount")}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-b border-muted-200 dark:border-muted-800 p-4 text-center">
                <h3 className="font-sans text-md font-semibold">
                  {(_f = activePhase === null || activePhase === void 0 ? void 0 : activePhase.contributions) !== null && _f !== void 0 ? _f : 0}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Contributions")}
                </p>
              </div>
            </div>
          </Card_1.default>
        </div>
      </div>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    const { id } = context.params;
    try {
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/ext/ico/offer/${id}`,
        });
        if (error || !data) {
            return {
                props: {
                    error: error || "Unable to fetch token details.",
                },
            };
        }
        return {
            props: {
                token: data,
            },
        };
    }
    catch (error) {
        console.error("Error fetching token details:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = OfferDetails;
