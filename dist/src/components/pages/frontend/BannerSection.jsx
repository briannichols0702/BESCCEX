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
const link_1 = __importDefault(require("next/link"));
const framer_motion_1 = require("framer-motion");
const next_i18next_1 = require("next-i18next");
const dashboard_1 = require("@/stores/dashboard");
const image_1 = __importDefault(require("next/image"));
const BannerSection = () => {
    const headingRef = (0, react_1.useRef)(null);
    const linkRef = (0, react_1.useRef)(null);
    const [isHeadingVisible, setHeadingVisible] = (0, react_1.useState)(false);
    const [isLinkVisible, setLinkVisible] = (0, react_1.useState)(false);
    const isHeadingInView = (0, framer_motion_1.useInView)(headingRef);
    const isLinkInView = (0, framer_motion_1.useInView)(linkRef);
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)(); // Get user profile data
    const [isLoggedIn, setIsLoggedIn] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setHeadingVisible(isHeadingInView);
    }, [isHeadingInView]);
    (0, react_1.useEffect)(() => {
        setLinkVisible(isLinkInView);
    }, [isLinkInView]);
    (0, react_1.useEffect)(() => {
        if (profile && profile.firstName) {
            setIsLoggedIn(true); // Check if the user is logged in
        }
    }, [profile]);
    return (<section className="w-full pb-10 px-4 sm:px-6 lg:px-8 md:pb-20 mx-auto dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] md:h-auto relative pt-16">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="max-w-7xl relative pt-6 lg:pt-0 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="relative rounded-xl p-5 sm:py-16 bg-muted-100 dark:bg-neutral-950">
          <div className="absolute inset-0 dark:hidden">
            <image_1.default src="/img/home/banner-bg.svg" alt="Banner Background" fill style={{ objectFit: "cover" }}/>
          </div>
          <div className="absolute inset-0 hidden dark:block">
            <image_1.default src="/img/home/banner-bg-dark.svg" alt="Banner Background" fill style={{ objectFit: "cover" }}/>
          </div>

          <div className="relative z-10 text-center mx-auto max-w-xl">
            <div className="mb-5">
              <framer_motion_1.motion.h2 className="text-3xl md:text-8xl lg:text-6xl font-bold bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent" initial={{ opacity: 0, y: 20 }} animate={isHeadingVisible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }} transition={{ duration: 1 }} ref={headingRef}>
                {t("Start Your Crypto Journey Now!")}
              </framer_motion_1.motion.h2>
              <framer_motion_1.motion.div className="mt-8 flex justify-center items-center space-x-4" initial={{ opacity: 0, y: 20 }} animate={isLinkVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 1, delay: 0.5 }} ref={linkRef}>
                <link_1.default href={isLoggedIn ? "/user" : "/login"} className="p-[3px] relative">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg"/>
                  <div className="px-8 py-[7px] bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent text-xl">
                    {t("Get Started")}
                  </div>
                </link_1.default>
              </framer_motion_1.motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>);
};
exports.default = BannerSection;
