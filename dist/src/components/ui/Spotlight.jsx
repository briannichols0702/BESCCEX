"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spotlight = void 0;
const react_1 = __importDefault(require("react"));
const cn_1 = require("@/utils/cn");
const Spotlight = ({ className, fill }) => {
    return (<svg className={(0, cn_1.cn)("pointer-events-none absolute z-1 h-[169%]  w-[138%] animate-spotlight opacity-0 lg:w-[84%]", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3787 2842" fill="none">
      <g filter="url(#filter)">
        <ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" fill={fill || "white"} fillOpacity="0.21"></ellipse>
      </g>
      <defs>
        <filter id="filter" x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8"></feGaussianBlur>
        </filter>
      </defs>
    </svg>);
};
exports.Spotlight = Spotlight;
