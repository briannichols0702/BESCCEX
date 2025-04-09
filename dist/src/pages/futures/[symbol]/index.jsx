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
const Nav_1 = __importDefault(require("@/layouts/Nav"));
const Orderbook_1 = require("@/components/pages/futures/orderbook/Orderbook");
const trades_1 = require("@/components/pages/futures/trades");
const chart_1 = require("@/components/pages/futures/chart");
const markets_1 = require("@/components/pages/futures/markets");
const ticker_1 = require("@/components/pages/futures/ticker");
const order_1 = require("@/components/pages/futures/order");
const orders_1 = require("@/components/pages/futures/orders");
const market_1 = __importDefault(require("@/stores/futures/market"));
const TradePage = () => {
    const { market } = (0, market_1.default)();
    return (<Nav_1.default title={(market === null || market === void 0 ? void 0 : market.symbol) || "Connecting..."} color="muted" horizontal darker>
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-1 mt-1 mb-5">
        <div className="col-span-1 md:col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-9 gap-1">
          <div className="border-thin col-span-1 md:col-span-9 min-h-[8vh] order-1 bg-white dark:bg-muted-900">
            <ticker_1.Ticker />
          </div>
          <div className="border-thin col-span-1 md:col-span-3 min-h-[50vh] md:min-h-[100vh] order-3 md:order-2 bg-white dark:bg-muted-900">
            <Orderbook_1.Orderbook />
          </div>
          <div className="w-full h-full col-span-1 md:col-span-6 flex flex-col gap-1 order-2 md:order-3">
            <div className="border-thin h-full min-h-[60vh] bg-white dark:bg-muted-900">
              <chart_1.Chart />
            </div>
            <div className="border-thin h-full min-h-[40vh] bg-white dark:bg-muted-900">
              <order_1.Order />
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-12 lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-1 order-4">
          <div className="border-thin h-full min-h-[55vh] w-full bg-white dark:bg-muted-900">
            <markets_1.Markets />
          </div>
          <div className="border-thin h-full min-h-[45vh] w-full min-w-[220px] bg-white dark:bg-muted-900">
            <trades_1.Trades />
          </div>
        </div>
        <div className="border-thin col-span-1 md:col-span-12 min-h-[40vh] order-5 bg-white dark:bg-muted-900">
          <orders_1.Orders />
        </div>
      </div>
    </Nav_1.default>);
};
exports.default = (0, react_1.memo)(TradePage);
