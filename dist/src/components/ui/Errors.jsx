"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPage = exports.NotFound = void 0;
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const next_i18next_1 = require("next-i18next");
const NotFound = ({ title, description, link, linkTitle, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Not Found")} color="muted">
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-muted-800 dark:text-muted-200">
          {t(`${title} Not Found`)}
        </h2>
        {description && (<p className="text-muted-600 dark:text-muted-400 mt-4">
            {t(description)}
          </p>)}
        <a href={link || "/"} className="text-primary-500 hover:underline mt-6 inline-block">
          {t(linkTitle || "Go Back")}
        </a>
      </div>
    </Default_1.default>);
};
exports.NotFound = NotFound;
const ErrorPage = ({ title, description, link, linkTitle, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Error")} color="muted">
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-danger-500">
          {t(title || "Error")}
        </h2>
        {description && (<p className="text-muted-600 dark:text-muted-400 mt-4">
            {t(description)}
          </p>)}
        <a href={link || "/"} className="text-primary-500 hover:underline mt-6 inline-block">
          {t(linkTitle || "Go Back")}
        </a>
      </div>
    </Default_1.default>);
};
exports.ErrorPage = ErrorPage;
