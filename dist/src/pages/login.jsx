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
const Minimal_1 = __importDefault(require("@/layouts/Minimal"));
const FormContent_1 = require("@/components/pages/login/FormContent");
const useWagmi_1 = __importDefault(require("@/context/useWagmi"));
const lottie_1 = require("@/components/elements/base/lottie");
const next_i18next_1 = require("next-i18next");
const HeaderSection_1 = require("@/components/pages/login/HeaderSection");
const login_1 = require("@/stores/auth/login");
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const dynamic_1 = __importDefault(require("next/dynamic"));
const WalletLogin = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/login/WalletLogin"))), { ssr: false });
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const SideImage = () => {
    const { settings } = (0, dashboard_1.useDashboardStore)();
    const isLoginLottieEnabled = (settings === null || settings === void 0 ? void 0 : settings.lottieAnimationStatus) === "true" &&
        (settings === null || settings === void 0 ? void 0 : settings.loginLottieEnabled) === "true";
    const loginLottieFile = settings === null || settings === void 0 ? void 0 : settings.loginLottieFile;
    return (<div className="hidden h-screen w-full md:w-1/2 lg:flex xl:w-2/3 max-w-3xl mx-auto items-center justify-center bg-muted-50 dark:bg-muted-950">
      {isLoginLottieEnabled ? (<lottie_1.Lottie category="cryptocurrency-3" path="mining"/>) : loginLottieFile ? (<img src={loginLottieFile} alt="Login Illustration" className="max-h-[80vh] object-contain"/>) : null}
    </div>);
};
function Login() {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { script, setVerificationCode, handleVerificationSubmit } = (0, login_1.useLoginStore)();
    const { fetchProfile, extensions } = (0, dashboard_1.useDashboardStore)();
    const hasWalletConnect = extensions.includes("wallet_connect");
    const { token } = router.query;
    (0, react_1.useEffect)(() => {
        if (router.isReady && token) {
            setVerificationCode(token);
            handleVerificationSubmit(token);
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        login_1.useLoginStore.getState().initializeRecaptcha();
    }, []);
    (0, react_1.useEffect)(() => {
        // Fetch profile when component mounts
        fetchProfile();
    }, []);
    const handleRouteChange = () => {
        if (script && script.parentNode) {
            script.parentNode.removeChild(script);
        }
        const recaptchaContainer = document.querySelector(".grecaptcha-badge");
        if (recaptchaContainer && recaptchaContainer.parentNode) {
            recaptchaContainer.parentNode.removeChild(recaptchaContainer);
        }
    };
    (0, react_1.useEffect)(() => {
        router.events.on("routeChangeStart", handleRouteChange);
        return () => {
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }
            const recaptchaContainer = document.querySelector(".grecaptcha-badge");
            if (recaptchaContainer && recaptchaContainer.parentNode) {
                recaptchaContainer.parentNode.removeChild(recaptchaContainer);
            }
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);
    return (<Minimal_1.default title={t("Login")} color="muted">
      <div id="recaptcha-container"></div>
      <div className="relative min-h-screen flex h-screen flex-col items-center bg-muted-50 dark:bg-muted-950 md:flex-row overflow-hidden">
        <SideImage />
        <div className="relative flex h-screen w-full items-center justify-center bg-white px-6 dark:bg-muted-900 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full lg:px-16 xl:w-1/3 xl:px-12">
          <HeaderSection_1.HeaderSection />
          <div className="mx-auto w-full max-w-sm px-4">
            {hasWalletConnect && projectId && (<useWagmi_1.default>
                <WalletLogin />
              </useWagmi_1.default>)}
            <FormContent_1.FormContent />
          </div>
        </div>
      </div>
    </Minimal_1.default>);
}
exports.default = Login;
