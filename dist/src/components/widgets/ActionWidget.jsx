"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const MashImage_1 = require("@/components/elements/MashImage");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const ActionWidget = ({ title, text, image, buttons, btnText = "Open Help Center", }) => {
    return (<div className="rounded-lg border border-muted-200 bg-white px-6 py-8 dark:border-muted-800 dark:bg-muted-900">
      <MashImage_1.MashImage className="w-full max-w-[280px] mx-auto" width={210} height={150} src={image} alt="Widget picture"/>
      <div className="py-4 text-center">
        <h3 className="mb-2 font-sans text-lg font-medium leading-tight text-muted-800 dark:text-muted-100">
          {title}
        </h3>
        <p className="text-center font-sans text-sm text-muted-400">
          {text
            ? text
            : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui non
          moveatur et offensione`}
        </p>
      </div>

      {buttons ? (buttons) : (<Button_1.default color="primary" className="w-full">
          {btnText}
        </Button_1.default>)}
    </div>);
};
exports.default = ActionWidget;
