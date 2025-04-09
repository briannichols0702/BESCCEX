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
const react_1 = require("react");
const router_1 = require("next/router");
require("@/styles/globals.css");
const sonner_1 = require("sonner");
const WebSocketContext_1 = require("@/context/WebSocketContext");
const layout_1 = require("@/stores/layout");
const next_i18next_1 = require("next-i18next");
require("../i18n");
const dashboard_1 = require("@/stores/dashboard");
const react_2 = require("@iconify/react");
const dynamic_1 = __importDefault(require("next/dynamic"));
const GoogleAnalytics = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/elements/addons/GoogleAnalytics"))), { ssr: false });
const FacebookPixel = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/elements/addons/FacebookPixel"))), { ssr: false });
const GoogleTranslate = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/elements/addons/GoogleTranslate"))), { ssr: false });
function MyApp({ Component, pageProps }) {
    const { fetchProfile, settings } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [mounted, setMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        (0, layout_1.restoreLayoutFromStorage)();
        setMounted(true);
    }, []);
    (0, react_1.useEffect)(() => {
        (0, layout_1.restoreLayoutFromStorage)();
    }, []);
    (0, react_1.useEffect)(() => {
        if (router.isReady && !settings) {
            fetchProfile();
        }
    }, [router.isReady, settings, fetchProfile]);
    (0, react_1.useEffect)(() => {
        const handleRouteChange = (url) => {
            if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_STATUS === "true") {
                const { gtag } = window;
                gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
                    page_path: url,
                });
            }
            if (process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_STATUS === "true") {
                const { fbq } = window;
                fbq("track", "PageView");
            }
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);
    if (!mounted) {
        // Ensures server and client render the same content
        return null;
    }
    if (!settings) {
        // This will now run only after the component has mounted
        return (<div className="flex justify-center items-center h-screen">
        <div className="text-lg">
          <react_2.Icon icon="mingcute:loading-3-line" className="animate-spin mr-2 h-12 w-12"/>
        </div>
      </div>);
    }
    return (<div className="dark:bg-muted-950/[0.96]">
      <sonner_1.Toaster closeButton richColors theme="system" position="top-center" toastOptions={{
            duration: 3000,
        }}/>
      <GoogleAnalytics />
      <FacebookPixel />
      {(settings === null || settings === void 0 ? void 0 : settings.googleTranslateStatus) === "true" && <GoogleTranslate />}
      <Component {...pageProps}/>
    </div>);
}
const AppWithProviders = (0, next_i18next_1.appWithTranslation)(MyApp);
function WrappedApp(props) {
    return (<WebSocketContext_1.AppWebSocketProvider>
      <AppWithProviders {...props}/>
    </WebSocketContext_1.AppWebSocketProvider>);
}
exports.default = WrappedApp;
