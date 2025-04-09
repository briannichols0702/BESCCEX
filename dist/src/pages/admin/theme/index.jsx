"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const react_1 = __importDefault(require("react"));
const head_1 = __importDefault(require("next/head"));
const next_i18next_1 = require("next-i18next");
const builder_1 = require("@/components/builder");
function Builder() {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="h-screen">
      <head_1.default>
        <title>{t("Builder")}</title>
      </head_1.default>
      <builder_1.EditorProvider />
    </div>);
}
exports.default = Builder;
exports.permission = "Access Frontend Builder";
