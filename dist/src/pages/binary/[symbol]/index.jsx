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
const react_1 = __importStar(require("react"));
const orders_1 = require("@/components/pages/binary/orders");
const styles_1 = require("@/components/layouts/styles");
const nav_1 = require("@/components/pages/binary/nav");
const market_1 = __importDefault(require("@/stores/trade/market"));
const chart_1 = require("@/components/pages/trade/chart");
const order_1 = require("@/components/pages/binary/order");
const router_1 = require("next/router");
const head_1 = __importDefault(require("next/head"));
const dashboard_1 = require("@/stores/dashboard");
const binaryStatus = Boolean(process.env.NEXT_PUBLIC_BINARY_STATUS || true);
const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME || "Default Site Title";
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Default Site Description";
const BinaryTradePageBase = () => {
    const router = (0, router_1.useRouter)();
    const { setWithEco } = (0, market_1.default)();
    const { settings } = (0, dashboard_1.useDashboardStore)();
    (0, react_1.useEffect)(() => {
        if (!binaryStatus) {
            router.push("/404");
        }
        else {
            setWithEco(false);
        }
    }, [router, setWithEco]);
    return (<>
      <head_1.default>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription}/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        <meta property="locale" content="en US"/>
        <meta name="robots" content="index,follow,max-image-preview:large"/>
        <meta name="twitter:card" content="summary large image"/>
        <meta property="og:height" content="630"/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:type" content="image/png"/>
        <meta property="og:type" content="website"/>

        <link rel="manifest" href="/manifest.json"/>

        {[
            {
                size: "57x57",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon57,
            },
            {
                size: "60x60",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon60,
            },
            {
                size: "72x72",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon72,
            },
            {
                size: "76x76",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon76,
            },
            {
                size: "114x114",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon114,
            },
            {
                size: "120x120",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon120,
            },
            {
                size: "144x144",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon144,
            },
            {
                size: "152x152",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon152,
            },
            {
                size: "180x180",
                src: settings === null || settings === void 0 ? void 0 : settings.appleIcon180,
            },
            {
                size: "192x192",
                src: settings === null || settings === void 0 ? void 0 : settings.androidIcon192,
            },
            {
                size: "256x256",
                src: settings === null || settings === void 0 ? void 0 : settings.androidIcon256,
            },
            {
                size: "384x384",
                src: settings === null || settings === void 0 ? void 0 : settings.androidIcon384,
            },
            {
                size: "512x512",
                src: settings === null || settings === void 0 ? void 0 : settings.androidIcon512,
            },
            {
                size: "32x32",
                src: settings === null || settings === void 0 ? void 0 : settings.favicon32,
            },
            {
                size: "96x96",
                src: settings === null || settings === void 0 ? void 0 : settings.favicon96,
            },
            {
                size: "16x16",
                src: settings === null || settings === void 0 ? void 0 : settings.favicon16,
            },
        ]
            .filter((icon) => icon.src) // Only include icons that have a src
            .map((icon) => (<link key={icon.size} rel="icon" type="image/png" sizes={icon.size} href={icon.src}/>))}

        {(settings === null || settings === void 0 ? void 0 : settings.msIcon144) && (<meta name="msapplication-TileImage" content={settings.msIcon144}/>)}
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <meta name="theme-color" content="#ffffff"/>
      </head_1.default>
      <div className="w-full h-full bg-white dark:bg-muted-900 ">
        <div className="sticky top-0 z-50 bg-white dark:bg-muted-900 w-[100%_-_4px]">
          <nav_1.BinaryNav />
        </div>

        <div className={`top-navigation-wrapper relative min-h-screen transition-all duration-300 dark:bg-muted-1000/[0.96] pt-16 lg:pt-4 pb-20 ${false
            ? "is-pushed " + styles_1.layoutPushedClasses["top-navigation"]
            : styles_1.layoutNotPushedClasses["top-navigation"]} bg-muted-50/[0.96] !pb-0 !pe-0 !pt-0`}>
          {/* <LayoutSwitcher /> */}
          <div className={`"max-w-full flex h-full min-h-screen flex-col [&>div]:h-full [&>div]:min-h-screen`}>
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-1 mt-1">
              <div className="border-thin col-span-1 md:col-span-10 lg:col-span-11 min-h-[55vh] md:min-h-[calc(100vh_-_120px)] bg-white dark:bg-muted-900">
                <chart_1.Chart />
              </div>
              <div className="border-thin col-span-1 md:col-span-2 lg:col-span-1 h-full bg-white dark:bg-muted-900">
                <order_1.Order />
              </div>
              <div className="border-thin col-span-1 md:col-span-12 min-h-[40vh] bg-white dark:bg-muted-900">
                <orders_1.Orders />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);
};
const BinaryTradePage = (0, react_1.memo)(BinaryTradePageBase);
exports.default = BinaryTradePage;
