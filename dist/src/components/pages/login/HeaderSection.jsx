"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderSection = void 0;
const LogoText_1 = __importDefault(require("@/components/vector/LogoText"));
const ThemeSwitcher_1 = __importDefault(require("@/components/widgets/ThemeSwitcher"));
const link_1 = __importDefault(require("next/link"));
const react_1 = require("react");
const HeaderSectionBase = () => (<div className="absolute inset-x-0 top-6 mx-auto w-full max-w-sm px-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <link_1.default href="/">
          <LogoText_1.default className="h-6 text-primary-500"/>
        </link_1.default>
      </div>
      <div className="flex items-center justify-end">
        <ThemeSwitcher_1.default />
      </div>
    </div>
  </div>);
exports.HeaderSection = (0, react_1.memo)(HeaderSectionBase);
