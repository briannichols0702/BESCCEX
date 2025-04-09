"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealCard = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const DealCardBase = ({ children, title, isToggle = false, }) => {
    const [panelOpened, setPanelOpened] = (0, react_1.useState)(true);
    const dealCardContentRef = (0, react_1.useRef)(null);
    const [contentHeight, setContentHeight] = (0, react_1.useState)("0px");
    (0, react_1.useEffect)(() => {
        var _a;
        if (panelOpened) {
            setContentHeight(((_a = dealCardContentRef.current) === null || _a === void 0 ? void 0 : _a.scrollHeight) + "px");
        }
        else {
            setContentHeight("0px");
        }
    }, [panelOpened, children]);
    return (<Card_1.default shape="smooth" color="contrast" className="p-5">
      <div onClick={() => {
            setPanelOpened(!panelOpened);
        }} className={`flex items-center justify-between ${isToggle ? "cursor-pointer" : ""}`}>
        <h3 className="font-sans text-xs font-medium uppercase text-muted-400">
          {title}
        </h3>
        <div className={`pointer-events-none ${panelOpened ? "rotate-90" : ""} ${isToggle
            ? "flex h-8 w-8 items-center justify-center rounded-full text-muted-400 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800 [&>svg]:h-4"
            : ""}`}>
          <react_2.Icon icon="lucide:chevron-right"/>
        </div>
      </div>
      <div ref={dealCardContentRef} style={{
            maxHeight: contentHeight,
        }} className={`grid grid-cols-1 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${panelOpened ? "mt-4" : "mt-0"}`}>
        {children}
      </div>
    </Card_1.default>);
};
exports.DealCard = (0, react_1.memo)(DealCardBase);
