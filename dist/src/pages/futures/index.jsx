"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importDefault(require("react"));
const marketsList_1 = __importDefault(require("@/components/pages/futures/marketsList"));
const next_i18next_1 = require("next-i18next");
const FuturesMarkets = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Futures")} color="muted">
      <marketsList_1.default />
    </Default_1.default>);
};
exports.default = FuturesMarkets;
