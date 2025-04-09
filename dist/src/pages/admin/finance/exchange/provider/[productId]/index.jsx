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
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const api_1 = __importDefault(require("@/utils/api"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const next_i18next_1 = require("next-i18next");
const ExchangeProviderPage = () => {
    var _a, _b, _c, _d, _e;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { productId } = router.query;
    const [exchange, setExchange] = (0, react_1.useState)(null);
    const [result, setResult] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (productId) {
            fetchExchangeDetails(productId);
        }
    }, [productId]);
    const fetchExchangeDetails = async (id) => {
        setLoading(true);
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/finance/exchange/provider/${id}`,
            silent: true,
        });
        if (!error) {
            setExchange(data.exchange);
            setResult(data.result);
        }
        setLoading(false);
    };
    const exchangeDetails = {
        binance: {
            imgSrc: "/img/exchanges/binance.svg",
            supportedCountries: "Countries and Regions",
            link: "https://www.binance.com/en/country-region-selector",
            description: "Binance Holdings Ltd., branded Binance, is a global company that operates the largest cryptocurrency exchange in terms of daily trading volume of cryptocurrencies. Binance was founded in 2017 by Changpeng Zhao, a developer who had previously created high-frequency trading software.",
        },
        kucoin: {
            imgSrc: "/img/exchanges/kucoin.svg",
            restrictedCountries: "The United States, North Korea, Singapore, Hong Kong, Iran, The Crimean region",
            description: "KuCoin is a large cryptocurrency exchange offering the ability to buy, sell, and trade cryptocurrencies. In addition to basic trading options, the platform offers margin, futures, and peer-to-peer (P2P) trading. Users can also choose to stake or lend their crypto to earn rewards.",
        },
        xt: {
            imgSrc: "/img/exchanges/xt.svg",
            restrictedCountries: "United States, Canada, Mainland China, Cuba, North Korea, Singapore, Sudan, Syria, Venezuela, Indonesia, Crimea",
            description: "XT is a global cryptocurrency exchange that provides a platform for trading more than 100 cryptocurrencies. Since early 2018, XT has been providing a secure, reliable, and advanced digital asset trading platform for global users.",
        },
    };
    const details = exchangeDetails[(_a = exchange === null || exchange === void 0 ? void 0 : exchange.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()];
    if (loading)
        return (<Default_1.default title={t("Loading...")} color="muted">
        <div className="flex items-center justify-center h-96 flex-col gap-5">
          <react_2.Icon icon="line-md:loading-loop" className="h-8 w-8 animate-spin text-primary-500"/>
          <span className="text-muted-600 dark:text-muted-400 ml-2">
            {t("Loading")} {t("Exchange")}...
          </span>
        </div>
      </Default_1.default>);
    return (<Default_1.default title={`${exchange === null || exchange === void 0 ? void 0 : exchange.title} Exchange`} color="muted">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 md:gap-10">
              <img src={details === null || details === void 0 ? void 0 : details.imgSrc} alt={exchange === null || exchange === void 0 ? void 0 : exchange.title} className="w-24 md:w-48"/>
              <div className="text-md flex gap-2">
                <Tag_1.default>{exchange === null || exchange === void 0 ? void 0 : exchange.version}</Tag_1.default>
                <Tag_1.default color={(exchange === null || exchange === void 0 ? void 0 : exchange.status) ? "success" : "danger"}>
                  {(exchange === null || exchange === void 0 ? void 0 : exchange.status) ? "Active" : "Inactive"}
                </Tag_1.default>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-md">
              {(details === null || details === void 0 ? void 0 : details.supportedCountries) && (<div>
                  <p className="text-muted-800 dark:text-muted-200">
                    {t("Supported Countries")}
                  </p>
                  <link_1.default href={details === null || details === void 0 ? void 0 : details.link} target="_blank" rel="noopener noreferrer" className="text-primary-500 dark:text-primary-400 underline">
                    {details === null || details === void 0 ? void 0 : details.supportedCountries}
                  </link_1.default>
                </div>)}
              {(details === null || details === void 0 ? void 0 : details.restrictedCountries) && (<p className="text-muted-600 dark:text-muted-400">
                  {t("Restricted Countries")} {details === null || details === void 0 ? void 0 : details.restrictedCountries}
                </p>)}
              <p className="text-muted-600 dark:text-muted-400">
                {details === null || details === void 0 ? void 0 : details.description}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {!(exchange === null || exchange === void 0 ? void 0 : exchange.licenseStatus) && (<link_1.default href={`/admin/finance/exchange/provider/${exchange === null || exchange === void 0 ? void 0 : exchange.productId}/license`}>
                <Button_1.default color="primary" className="ml-2" shape={"rounded-sm"}>
                  {t("Activate License")}
                </Button_1.default>
              </link_1.default>)}
            <BackButton_1.BackButton href="/admin/finance/exchange"/>
          </div>
        </div>
        {result && (<Alert_1.default label={<div className="text-xl">
                {result.status ? "Success!" : "Error!"}{" "}
                <span className="text-muted-600 dark:text-muted-400">
                  {result.status
                    ? "Credentials are valid"
                    : "Credentials are invalid"}
                </span>
              </div>} sublabel={<div className="text-md">
                {result.message}
                {result.status === false && (<>
                    <p className="text-primary-500 dark:text-primary-400 mt-4">
                      {t("Please check your credentials in the .env file and try again. Note that any changes to the .env file will require a server restart.")}
                    </p>
                    <p className="text-muted-600 dark:text-muted-400 mt-4">
                      {t("If you don&apos;t have the credentials, please visit the exchange website to create an API key, secret, and passphrase (if required).")}
                    </p>
                    <p className="text-muted-600 dark:text-muted-400">
                      {t("Once you have the credentials, add them to your .env file as shown below")}
                    </p>
                    <div className="text-muted-600 dark:text-muted-400 mt-4 prose text-sm max-w-xl">
                      <pre>
                        <li>APP_{(_b = exchange === null || exchange === void 0 ? void 0 : exchange.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()}_API_KEY</li>
                        <li>APP_{(_c = exchange === null || exchange === void 0 ? void 0 : exchange.name) === null || _c === void 0 ? void 0 : _c.toUpperCase()}_API_SECRET</li>
                        {((_d = exchange === null || exchange === void 0 ? void 0 : exchange.name) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === "BINANCE" && (<li>
                            APP_{(_e = exchange === null || exchange === void 0 ? void 0 : exchange.name) === null || _e === void 0 ? void 0 : _e.toUpperCase()}_API_PASSPHRASE
                          </li>)}
                      </pre>
                    </div>
                    <p className="text-muted-600 dark:text-muted-400 mt-4">
                      {t("If you&apos;re still having issues, please check the following")}
                    </p>
                    <ul className="list-disc list-inside mt-4 text-info-500 dark:text-info-400">
                      <li>
                        {t("You may also need to whitelist your server IP address in the exchange settings.")}
                      </li>
                      <li>
                        {t("Make sure you enable all permissions except those that prevent withdrawals to unlisted addresses.")}
                      </li>
                      <li>
                        {t("If this is your first time using this exchange, make sure your account is new and KYC is verified.")}
                      </li>
                    </ul>
                  </>)}
              </div>} color={result.status ? "success" : "danger"} className="mt-6" canClose={false}/>)}
        <hr className="my-6 border-t border-muted-300 dark:border-muted-700"/>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <CardLink icon="mdi:chart-line" label={t("Markets")} href="/admin/finance/exchange/market"/>
          <CardLink icon="mdi:currency-usd" label={t("Currencies")} href="/admin/finance/currency/spot"/>
          <CardLink icon="mdi:wallet" label={t("Balances")} href="/admin/finance/exchange/balance" disabled={(result === null || result === void 0 ? void 0 : result.status) === false}/>
          <CardLink icon="mdi:cash-multiple" label={t("Fees")} href="/admin/finance/exchange/fee" disabled={(result === null || result === void 0 ? void 0 : result.status) === false}/>
        </div>
      </main>
    </Default_1.default>);
};
const CardLink = ({ icon, label, href, disabled, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    if (disabled) {
        return (<Tooltip_1.Tooltip content={t("Please check your credentials before proceeding")}>
        <Card_1.default className="flex items-center p-4 cursor-not-allowed bg-muted-100 dark:bg-muted-800">
          <react_2.Icon icon={icon} className="h-8 w-8 text-muted-400 dark:text-muted-400 mr-4"/>
          <span className="text-muted-400 dark:text-muted-400">{label}</span>
        </Card_1.default>
      </Tooltip_1.Tooltip>);
    }
    else {
        return (<link_1.default href={href}>
        <Card_1.default className="flex items-center p-4 cursor-pointer hover:bg-muted-100 dark:hover:bg-muted-800">
          <react_2.Icon icon={icon} className="h-8 w-8 text-muted-600 dark:text-muted-400 mr-4"/>
          <span className="text-muted-800 dark:text-muted-100">{label}</span>
        </Card_1.default>
      </link_1.default>);
    }
};
exports.default = ExchangeProviderPage;
exports.permission = "Access Exchange Provider Management";
