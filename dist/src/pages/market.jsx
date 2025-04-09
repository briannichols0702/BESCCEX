"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importDefault(require("react"));
const Markets_1 = __importDefault(require("@/components/pages/user/markets/Markets"));
const next_i18next_1 = require("next-i18next");
const News_1 = require("@/components/pages/user/News");
const dashboard_1 = require("@/stores/dashboard");
const newsStatus = process.env.NEXT_PUBLIC_NEWS_STATUS === "true" || false;
const MarketsPage = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { settings } = (0, dashboard_1.useDashboardStore)();
    return (<Default_1.default title={t("Markets")} color="muted">
      <Markets_1.default />
      {(settings === null || settings === void 0 ? void 0 : settings.newsStatus) === "true" && <News_1.News />}
    </Default_1.default>);
};
exports.default = MarketsPage;
