"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/pages/index.jsx
const react_1 = __importDefault(require("react"));
const HeroSection_1 = __importDefault(require("@/components/pages/frontend/HeroSection"));
const FeaturesSection_1 = __importDefault(require("@/components/pages/frontend/FeaturesSection"));
const Footer_1 = __importDefault(require("@/components/pages/frontend/Footer"));
const Nav_1 = __importDefault(require("@/layouts/Nav"));
const BuilderComponent_1 = __importDefault(require("@/components/pages/frontend/BuilderComponent"));
const StatusSection_1 = __importDefault(require("@/components/pages/frontend/StatusSection"));
const Cookie_1 = __importDefault(require("@/components/pages/frontend/Cookie"));
const BannerSection_1 = __importDefault(require("@/components/pages/frontend/BannerSection"));
const MarketsSection_1 = __importDefault(require("@/components/pages/frontend/MarketsSection"));
const dashboard_1 = require("@/stores/dashboard");
const Home = () => {
    const { settings } = (0, dashboard_1.useDashboardStore)();
    if ((settings === null || settings === void 0 ? void 0 : settings.frontendType) === "builder")
        return <BuilderComponent_1.default />;
    return (<Nav_1.default horizontal>
      <HeroSection_1.default />
      <MarketsSection_1.default />
      <StatusSection_1.default />
      <FeaturesSection_1.default />
      <BannerSection_1.default />
      <Footer_1.default />
      <Cookie_1.default />
    </Nav_1.default>);
};
exports.default = Home;
