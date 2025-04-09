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
const framer_motion_1 = require("framer-motion");
const react_1 = __importStar(require("react"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const link_1 = __importDefault(require("next/link"));
const next_i18next_1 = require("next-i18next");
const dashboard_1 = require("@/stores/dashboard");
const constants_1 = require("@/utils/constants");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const wallet_1 = require("@/stores/user/wallet");
const throttle_1 = require("@/utils/throttle");
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
const HeroSection = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { isDark, profile } = (0, dashboard_1.useDashboardStore)();
    const [isLoggedIn, setIsLoggedIn] = (0, react_1.useState)(false);
    const { pnl, fetchPnl } = (0, wallet_1.useWalletStore)();
    const debounceFetchPnl = (0, throttle_1.debounce)(fetchPnl, 100);
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (profile && profile.firstName) {
            setLoading(true);
            setIsLoggedIn(true);
            debounceFetchPnl();
            setLoading(false);
        }
    }, [profile]);
    return (<section className="w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex flex-col md:flex-row items-center justify-center md:h-auto relative">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {/* Hero */}
      <div className="max-w-7xl relative pt-12 lg:pt-0 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="text-center md:text-left flex flex-col justify-center">
            <framer_motion_1.motion.h1 className="text-6xl md:text-8xl lg:text-10xl font-bold text-muted-800 dark:text-muted-200" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              {t("Find the Next")}{" "}
              <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {t("Crypto Gem")}
              </span>{" "}
              {t("on")} {siteName}
            </framer_motion_1.motion.h1>
            <framer_motion_1.motion.p className="mt-4 text-lg md:text-xl text-muted-600 dark:text-muted-400" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
              {t("We provide the latest information on the best cryptocurrencies to invest in.")}
            </framer_motion_1.motion.p>
            {isLoggedIn && pnl ? (<framer_motion_1.motion.div className="flex flex-col items-center md:items-start mt-5 space-y-2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
                <h2 className="text-md font-bold text-muted-800 dark:text-muted-200">
                  {t("Your Estimated Balance")}
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-semibold text-primary-500">
                    {(pnl === null || pnl === void 0 ? void 0 : pnl.today) ? (`$${(_a = pnl.today) === null || _a === void 0 ? void 0 : _a.toFixed(2)}`) : loading ? (<react_loading_skeleton_1.default width={60} height={12} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>) : ("$0.00")}
                  </span>
                </div>
                <div className="text-md text-green-500 flex gap-2 pb-5">
                  <div>{t("Today's PnL")}:</div>
                  {(pnl === null || pnl === void 0 ? void 0 : pnl.today) ? (<>
                      {pnl.today > pnl.yesterday && pnl.yesterday !== 0 ? (<span className="flex items-center gap-2 text-green-500">
                          <span>
                            +${(pnl.today - pnl.yesterday).toFixed(2)}
                          </span>
                          <span className="text-md">
                            (+
                            {pnl.yesterday !== 0
                        ? (((pnl.today - pnl.yesterday) /
                            pnl.yesterday) *
                            100).toFixed(2)
                        : "0"}
                            %)
                          </span>
                        </span>) : pnl.today < pnl.yesterday ? (<span className="flex items-center gap-2 text-red-500">
                          <span>
                            -${(pnl.yesterday - pnl.today).toFixed(2)}
                          </span>
                          <span className="text-md">
                            (-
                            {pnl.yesterday !== 0
                        ? (((pnl.yesterday - pnl.today) /
                            pnl.yesterday) *
                            100).toFixed(2)
                        : 0}
                            %)
                          </span>
                        </span>) : (<span className="flex items-center gap-2 text-gray-500">
                          <span>$0.00</span>
                          <span className="text-md">(0.00%)</span>
                        </span>)}
                    </>) : loading ? (<react_loading_skeleton_1.default width={60} height={12} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>) : ("$0.00")}
                </div>
                <div className="flex space-x-4">
                  <link_1.default href="/user/wallet/deposit">
                    <Button_1.default color="warning" shape={"rounded-xs"} variant={"outlined"}>
                      {t("Deposit")}
                    </Button_1.default>
                  </link_1.default>
                  <link_1.default href="/user/wallet/withdraw">
                    <Button_1.default color="muted" shape={"rounded-xs"} variant={"outlined"}>
                      {t("Withdraw")}
                    </Button_1.default>
                  </link_1.default>
                  <link_1.default href="/market">
                    <Button_1.default color="muted" shape={"rounded-xs"} variant={"outlined"}>
                      {t("Trade")}
                    </Button_1.default>
                  </link_1.default>
                </div>
              </framer_motion_1.motion.div>) : (<>
                <framer_motion_1.motion.div className="mt-8 flex justify-center md:justify-start items-center space-x-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}>
                  <div className="max-w-xs">
                    <Input_1.default type="text" placeholder={t("Enter your email")} size={"lg"} color={"contrast"}/>
                  </div>
                  <link_1.default href="/register" className="p-[3px] relative">
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg"/>
                    <div className="px-8 py-[7px] bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent text-md">
                      {t("Sign Up Now")}
                    </div>
                  </link_1.default>
                </framer_motion_1.motion.div>
              </>)}
          </div>
          {/* End Col */}
          <div className="w-full h-[20rem] sm:h-[30rem] lg:h-[35rem] overflow-hidden rounded-lg" style={{ perspective: "700px" }}>
            <div className="grid grid-cols-3 gap-12 w-[60rem] sm:w-[80rem] lg:w-[50rem] h-[55rem] md:h-[90rem] lg:h-[75rem] overflow-hidden origin-[50%_0%]" style={{
            transform: "translate3d(7%, -2%, 0px) scale3d(0.9, 0.8, 1) rotateX(15deg) rotateY(-9deg) rotateZ(32deg)",
        }}>
              {Object.entries(constants_1.frontendBannerImageColumns).map(([key, images], colIndex) => (<div key={colIndex} className={`grid gap-9 w-full h-[440px] ${colIndex === 0
                ? "animation-sliding-img-up-1"
                : colIndex === 1
                    ? "animation-sliding-img-down-1"
                    : "animation-sliding-img-up-2"}`}>
                    {images.map((image, index) => (<react_1.default.Fragment key={index}>
                        <img className="w-full object-cover shadow-lg rounded-lg dark:shadow-neutral-900/80 dark:hidden border border-muted-200 dark:border-muted-800
            hover:border hover:border-primary-500 dark:hover:border dark:hover:border-primary-400 transition-all duration-300" src={image.light} alt={`Image ${index + 1}`}/>
                        <img className="hidden w-full object-cover shadow-lg rounded-lg dark:shadow-neutral-900/80 dark:block border border-muted-200 dark:border-muted-800
            hover:border hover:border-primary-500 dark:hover:border dark:hover:border-primary-400 transition-all duration-300" src={image.dark} alt={`Image ${index + 1}`}/>
                      </react_1.default.Fragment>))}
                  </div>))}
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Hero */}
    </section>);
};
exports.default = HeroSection;
