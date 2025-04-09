"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const LogoText_1 = __importDefault(require("@/components/vector/LogoText"));
const ThemeSwitcher_1 = __importDefault(require("@/components/widgets/ThemeSwitcher"));
const MinimalHeader = () => {
    return (<div className="absolute left-0 top-0 w-full px-3 z-30">
      <div className="mx-auto lg:max-w-[1152px]">
        <div className="flex min-h-[3.6rem] items-center justify-between">
          <div className="flex items-center">
            <link_1.default href="/">
              <LogoText_1.default className="h-7 md:h-8 text-muted-900 dark:text-white"/>
            </link_1.default>
          </div>
          <div className="flex items-center justify-end">
            <ThemeSwitcher_1.default />
          </div>
        </div>
      </div>
    </div>);
};
exports.default = MinimalHeader;
