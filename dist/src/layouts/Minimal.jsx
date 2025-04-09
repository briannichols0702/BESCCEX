"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const head_1 = __importDefault(require("next/head"));
const dashboard_1 = require("@/stores/dashboard");
const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME;
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION;
const Layout = ({ children, title = siteTitle, description = siteDescription, color = "default", }) => {
    const { settings } = (0, dashboard_1.useDashboardStore)();
    return (<main>
      <head_1.default>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        <meta property="locale" content="en US"/>
        <meta name="robots" content="index,follow,max-image-preview:large"/>
        <meta name="twitter:card" content="summary large image"/>
        <meta property="og:height" content="630"/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:type" content="image/png"/>
        <meta property="og:type" content="website"/>

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
        <link rel="manifest" href="/manifest.json"/>
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <meta name="theme-color" content="#ffffff"/>
      </head_1.default>
      <div className={`min-h-screen transition-all duration-300 ${color === "muted" ? "bg-muted-50" : "bg-white"} dark:bg-muted-900`}>
        {children}
      </div>
    </main>);
};
exports.default = Layout;
