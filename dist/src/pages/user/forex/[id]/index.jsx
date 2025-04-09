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
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const ForexAccountView = () => {
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [account, setAccount] = (0, react_1.useState)(null);
    const [windowSize, setWindowSize] = (0, react_1.useState)({
        width: process.browser ? window.innerWidth : 0,
        height: process.browser ? window.innerHeight : 0,
    });
    const fetchForexAccount = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/forex/account/${id}`,
            silent: true,
        });
        if (!error) {
            setAccount(data);
        }
    };
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        if (id) {
            fetchForexAccount();
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [id]);
    return (<div>
      {account && (<iframe key={account.accountId} src={`https://metatraderweb.app/trade?servers=${account.broker}&trade_server=${account.broker}&startup_mode=${account.type === "DEMO" ? "open_demo" : "open_trade"}&startup_version=${account.mt}&lang=EN&save_password=on&login=${account.accountId}&password=${account.password}&leverage=${account.leverage}`} allowFullScreen style={{
                height: `calc(${windowSize.height}px - 96px)`,
                width: "100%",
            }}/>)}
    </div>);
};
exports.default = ForexAccountView;
