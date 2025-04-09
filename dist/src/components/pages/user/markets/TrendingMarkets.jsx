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
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const lodash_1 = require("lodash");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const LineChart_1 = __importDefault(require("./LineChart"));
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const marquee_1 = __importDefault(require("@/components/elements/base/marquee"));
const generateFakeHistory = (initialPrice, length = 15) => {
    const history = [];
    let lastPrice = initialPrice;
    for (let i = 0; i < length; i++) {
        const variation = (Math.random() - 0.5) * 0.02;
        const price = lastPrice * (1 + variation);
        history.push(price);
        lastPrice = price;
    }
    return history;
};
const TrendingMarkets = () => {
    const { createConnection, subscribe, unsubscribe, addMessageHandler, removeMessageHandler, } = (0, ws_1.default)();
    const router = (0, router_1.useRouter)();
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    const [tickersFetched, setTickersFetched] = (0, react_1.useState)(false);
    const [marketItems, setMarketItems] = (0, react_1.useState)([]);
    const maxItemsToShow = 10;
    (0, react_1.useEffect)(() => {
        setIsMounted(true);
    }, []);
    const updateItem = (0, react_1.useCallback)((existingItem, update) => {
        const parseToNumber = (value) => {
            const parsedValue = typeof value === "number" ? value : parseFloat(value);
            return isNaN(parsedValue) ? 0 : parsedValue;
        };
        const newPrice = (update === null || update === void 0 ? void 0 : update.last) !== undefined
            ? parseToNumber(update.last)
            : existingItem.price;
        return {
            ...existingItem,
            price: newPrice,
            change: (update === null || update === void 0 ? void 0 : update.change) !== undefined
                ? parseToNumber(update.change)
                : existingItem.change,
            history: [...existingItem.history, newPrice].slice(-15),
        };
    }, []);
    const updateItems = (0, react_1.useCallback)((newData) => {
        setMarketItems((prevItems) => {
            const updatedItems = prevItems.map((item) => {
                const update = newData[item.symbol];
                return update ? updateItem(item, update) : updateItem(item, null);
            });
            const newMarkets = Object.keys(newData)
                .filter((key) => !prevItems.find((item) => item.symbol === key))
                .map((key) => ({
                symbol: key,
                currency: key.split("/")[0],
                price: newData[key].last,
                change: newData[key].change,
                history: generateFakeHistory(newData[key].last),
            }));
            return [...updatedItems, ...newMarkets].slice(0, maxItemsToShow);
        });
    }, [updateItem]);
    const debouncedUpdateItems = (0, react_1.useCallback)((0, lodash_1.debounce)(updateItems, 100), [
        updateItems,
    ]);
    const fetchTickers = (0, react_1.useCallback)(async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/exchange/ticker",
            silent: true,
        });
        if (error) {
            return;
        }
        if (data) {
            debouncedUpdateItems(data);
        }
        setTickersFetched(true);
    }, [debouncedUpdateItems]);
    const debouncedFetchTickers = (0, react_1.useCallback)((0, lodash_1.debounce)(fetchTickers, 100), [
        fetchTickers,
    ]);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            debouncedFetchTickers();
            return () => {
                setTickersFetched(false);
            };
        }
    }, [router.isReady, debouncedFetchTickers]);
    (0, react_1.useEffect)(() => {
        if (tickersFetched) {
            createConnection("tickersConnection", "/api/exchange/ticker", {
                onOpen: () => {
                    subscribe("tickersConnection", "tickers");
                },
            });
            return () => {
                unsubscribe("tickersConnection", "tickers");
            };
        }
    }, [tickersFetched, createConnection, subscribe, unsubscribe]);
    const handleTickerMessage = (0, react_1.useCallback)((message) => {
        const { data } = message;
        if (!data)
            return;
        updateItems(data);
    }, [updateItems]);
    const messageFilter = (0, react_1.useCallback)((message) => message.stream && message.stream === "tickers", []);
    (0, react_1.useEffect)(() => {
        if (tickersFetched) {
            addMessageHandler("tickersConnection", handleTickerMessage, messageFilter);
            return () => {
                removeMessageHandler("tickersConnection", handleTickerMessage);
            };
        }
    }, [
        tickersFetched,
        addMessageHandler,
        handleTickerMessage,
        messageFilter,
        removeMessageHandler,
    ]);
    const memoizedMarketItems = (0, react_1.useMemo)(() => marketItems.slice(0, maxItemsToShow), [marketItems]);
    if (!isMounted) {
        return null;
    }
    if (marketItems.length === 0) {
        return <div>Loading market data...</div>;
    }
    return (<div className="relative overflow-hidden whitespace-nowrap">
      <marquee_1.default speed={32} showGradients={true} direction="rtl">
        {memoizedMarketItems.map((item, i) => (<link_1.default key={i} href={`/trade/${item.symbol.replace("/", "_")}`}>
            <div className="p-4 mx-2 border border-muted-200 dark:border-muted-800 hover:border hover:border-primary-500 dark:hover:border dark:hover:border-primary-400 transition-all duration-300 bg-linear-to-r from-white to-white dark:from-muted-900 dark:to-muted-1000 dark:bg-linear-to-r rounded-xl" style={{
                width: "300px",
                flexShrink: 0,
                marginRight: "16px",
            }}>
              <div className="flex items-center gap-4 pe-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar_1.default size="xxs" src={`/img/crypto/${item.currency
                .toLowerCase()
                .replace("1000", "")}.webp`}/>
                    <span className="text-md text-muted-700 dark:text-muted-200">
                      {item.symbol}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-muted-700 dark:text-muted-200 mb-2">
                    {item.price !== undefined ? item.price.toFixed(2) : "N/A"}
                  </div>
                  <div className={`text-md font-semibold ${item.change >= 0 ? "text-success-500" : "text-danger-500"} mb-4`}>
                    {item.change !== undefined ? item.change.toFixed(2) : "N/A"}
                    %
                  </div>
                </div>
                <div className="w-40 h-20 py-1">
                  <LineChart_1.default width={150} height={80} values={item.history}/>
                </div>
              </div>
            </div>
          </link_1.default>))}
      </marquee_1.default>
    </div>);
};
exports.default = TrendingMarkets;
