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
const react_2 = require("@iconify/react");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const market_1 = __importDefault(require("@/stores/futures/market"));
const lodash_1 = require("lodash");
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
require("react-loading-skeleton/dist/skeleton.css");
const market_2 = require("@/utils/market");
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const HeadCell_1 = __importDefault(require("../../user/markets/HeadCell"));
const api_1 = __importDefault(require("@/utils/api"));
const FuturesMarketsBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { marketData, fetchData, setSearchQuery, getPrecisionBySymbol } = (0, market_1.default)();
    const { createConnection, subscribe, unsubscribe, addMessageHandler, removeMessageHandler, } = (0, ws_1.default)();
    const [items, setItems] = (0, react_1.useState)([]);
    const [pages, setPages] = (0, react_1.useState)([]);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [perPage, setPerPage] = (0, react_1.useState)(10);
    const [sorted, setSorted] = (0, react_1.useState)({
        field: "",
        rule: "asc",
    });
    const [pagination, setPagination] = (0, react_1.useState)({
        total: 0,
        lastPage: 0,
        currentPage: 1,
        from: 1,
        to: 10,
    });
    const router = (0, router_1.useRouter)();
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    const debouncedFetchData = (0, lodash_1.debounce)(fetchData, 100);
    const [tickersFetched, setTickersFetched] = (0, react_1.useState)(false);
    const [tickersConnected, setTickersConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setItems(marketData);
        updatePagination(marketData.length, perPage, currentPage);
    }, [marketData, perPage, currentPage]);
    const updatePagination = (totalItems, itemsPerPage, currentPage) => {
        const lastPage = Math.ceil(totalItems / itemsPerPage);
        const from = (currentPage - 1) * itemsPerPage + 1;
        const to = Math.min(currentPage * itemsPerPage, totalItems);
        setPagination({
            total: totalItems,
            lastPage,
            currentPage,
            from,
            to,
        });
        setPages(calculatePages(totalItems, itemsPerPage));
    };
    const calculatePages = (totalItems, itemsPerPage) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    };
    const changePage = (0, react_1.useCallback)((page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            setCurrentPage(page);
            updatePagination(items.length, perPage, page);
        }
    }, [pagination.lastPage, perPage, items.length]);
    const changePerPage = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
        updatePagination(items.length, newPerPage, 1);
    };
    const updateItem = (existingItem, update) => {
        const precision = getPrecisionBySymbol(existingItem.symbol);
        const parseToNumber = (value, defaultValue = 0) => {
            if (value === null || value === undefined) {
                return defaultValue;
            }
            const parsedValue = typeof value === "number" ? value : parseFloat(value);
            return isNaN(parsedValue) ? defaultValue : parsedValue;
        };
        return {
            ...existingItem,
            price: update.last !== undefined
                ? parseToNumber(update.last).toFixed(precision.price)
                : existingItem.price,
            change: update.change !== undefined
                ? parseToNumber(update.change).toFixed(2)
                : existingItem.change,
            baseVolume: update.baseVolume !== undefined
                ? (0, market_2.formatLargeNumber)(update.baseVolume, precision.amount)
                : existingItem.baseVolume,
            quoteVolume: update.quoteVolume !== undefined
                ? (0, market_2.formatLargeNumber)(update.quoteVolume, precision.price)
                : existingItem.quoteVolume,
            high: update.high !== undefined ? update.high : existingItem.high,
            low: update.low !== undefined ? update.low : existingItem.low,
            percentage: update.percentage !== undefined
                ? update.percentage
                : existingItem.percentage,
        };
    };
    const updateItems = (newData) => {
        setItems((prevItems) => {
            const updatedItems = prevItems.map((item) => {
                const update = newData[item.symbol];
                return update ? updateItem(item, update) : item;
            });
            return updatedItems;
        });
    };
    const fetchTickers = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/ext/futures/ticker",
            silent: true,
        });
        if (!error) {
            updateItems(data);
        }
        setTickersFetched(true);
    };
    const debouncedFetchTickers = (0, lodash_1.debounce)(fetchTickers, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            debouncedFetchData();
            debouncedFetchTickers();
            return () => {
                setTickersFetched(false);
            };
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        if (tickersFetched) {
            createConnection("futuresTickersConnection", `/api/ext/futures/ticker`, {
                onOpen: () => {
                    subscribe("futuresTickersConnection", "tickers");
                },
            });
            setTickersConnected(true);
            return () => {
                unsubscribe("futuresTickersConnection", "tickers");
            };
        }
    }, [tickersFetched]);
    const handleTickerMessage = (message) => {
        const { data } = message;
        if (!data)
            return;
        updateItems(data);
    };
    const messageFilter = (message) => message.stream && message.stream === "tickers";
    (0, react_1.useEffect)(() => {
        if (tickersConnected) {
            addMessageHandler("futuresTickersConnection", handleTickerMessage, messageFilter);
            return () => {
                removeMessageHandler("futuresTickersConnection", handleTickerMessage);
            };
        }
    }, [tickersConnected]);
    function compareOnKey(key, rule) {
        return function (a, b) {
            if (typeof a[key] === "string" && typeof b[key] === "string") {
                return rule === "asc"
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            }
            if (Array.isArray(a[key]) && Array.isArray(b[key])) {
                return rule === "asc"
                    ? a[key].length - b[key].length
                    : b[key].length - a[key].length;
            }
            return rule === "asc" ? a[key] - b[key] : b[key] - a[key];
        };
    }
    function sort(field, rule) {
        const copy = [...items];
        copy.sort(compareOnKey(field, rule));
        setSorted({ field, rule });
    }
    const search = (0, react_1.useCallback)((query) => {
        setSearchQuery(query);
        const filteredData = marketData.filter((item) => item.symbol.toLowerCase().includes(query.toLowerCase()));
        setItems(filteredData);
        updatePagination(filteredData.length, perPage, 1);
    }, [marketData, setSearchQuery, perPage]);
    const handleSearchChange = (event) => {
        const { value } = event.target;
        search(value);
    };
    return (<main id="datatable">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="font-sans text-2xl font-light text-muted-700 dark:text-muted-200">
            {t("Markets Overview")}
          </h2>
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="hidden w-full md:block md:w-auto">
            <Input_1.default icon="lucide:search" color="contrast" placeholder={t("Search...")} onChange={handleSearchChange}/>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col overflow-x-auto lg:overflow-x-visible ltablet:overflow-x-visible">
        <table className="border border-muted-200 bg-white font-sans dark:border-muted-800 dark:bg-muted-950">
          <thead className="border-b border-fade-grey-2 dark:border-muted-800">
            <tr className=" divide-x divide-muted-200 dark:divide-muted-800">
              <th className="w-[30%] p-4">
                <HeadCell_1.default label={t("Name")} sortFn={sort} sortField="symbol" sorted={sorted}/>
              </th>
              <th className="w-[20%] p-4">
                <HeadCell_1.default label={t("Price")} sortFn={sort} sortField="price" sorted={sorted}/>
              </th>
              <th className="w-[20%] p-4">
                <HeadCell_1.default label={t("Change")} sortFn={sort} sortField="change" sorted={sorted}/>
              </th>
              <th className="w-[25%] p-4">
                <HeadCell_1.default label={t("24h Volume")} sortFn={sort} sortField="baseVolume" sorted={sorted}/>
              </th>
              <th className="w-[5%] text-end"></th>
            </tr>
          </thead>

          <tbody>
            {items
            .slice((pagination.currentPage - 1) * perPage, pagination.currentPage * perPage)
            .map((item, i) => (<tr key={i} className={`border-b border-muted-200 transition-colors duration-300 last:border-none 
              hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-900/60 cursor-pointer`} onClick={() => router.push(`/futures/${item.symbol.replace("/", "_")}`)}>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <Avatar_1.default size="xxs" src={item.icon ||
                `/img/crypto/${item.currency.toLowerCase()}.webp`}/>
                      <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
                        {item.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
                      {item.price || (<react_loading_skeleton_1.default width={40} height={10} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span className={`line-clamp-1 text-md text-${item.change >= 0
                ? item.change === 0
                    ? "muted"
                    : "success"
                : "danger"}-500`}>
                      {item.change ? (`${item.change}%`) : (<react_loading_skeleton_1.default width={40} height={10} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div>
                      <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
                        {item.baseVolume || (<react_loading_skeleton_1.default width={40} height={10} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>)}{" "}
                        <span className=" text-muted-400 text-xs">
                          ({item.currency})
                        </span>
                      </span>
                      <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
                        {item.quoteVolume || (<react_loading_skeleton_1.default width={40} height={10} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>)}{" "}
                        <span className=" text-muted-400 text-xs">
                          ({item.pair})
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-end">
                    <link_1.default href={`/futures/${item.symbol.replace("/", "_")}`}>
                      <IconButton_1.default color="contrast" variant="pastel" size="sm">
                        <react_2.Icon icon="akar-icons:arrow-right" width={16}/>
                      </IconButton_1.default>
                    </link_1.default>
                  </td>
                </tr>))}
            {pagination.total === 0 && (<tr>
                <td colSpan={5} className="py-3 text-center">
                  <div className="py-32">
                    <react_2.Icon icon="arcticons:samsung-finder" className="mx-auto h-20 w-20 text-muted-400"/>
                    <h3 className="mb-2 font-sans text-xl text-muted-700 dark:text-muted-200">
                      {t("Nothing found")}
                    </h3>
                    <p className="mx-auto max-w-[280px] font-sans text-md text-muted-400">
                      {t("Sorry, looks like we couldn't find any matching records. Try different search terms.")}
                    </p>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="hidden items-center gap-2 rounded-xl border border-muted-200 bg-white py-1 pe-3 ps-1 dark:border-muted-800 dark:bg-muted-950 md:flex">
            <Select_1.default color="contrast" value={perPage.toString()} onChange={(e) => changePerPage(+e.target.value)} options={["5", "10", "25", "50", "100"]}/>
            <p className="whitespace-nowrap font-sans text-md text-muted-400">
              {t("Per page")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end divide-x divide-muted-300 dark:divide-muted-800">
          <div className="flex items-center px-6">
            <button type="button" onClick={() => changePage(1)} className="cursor-pointer text-md text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline">
              <span>{t("First")}</span>
            </button>
            <span className="cursor-pointer px-2 text-md text-muted-400">
              ·
            </span>
            <button type="button" onClick={() => changePage(pagination.lastPage)} className="cursor-pointer text-md text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline">
              <span>{t("Last")}</span>
            </button>
          </div>
          <div className="flex items-center justify-end ps-6">
            <div className="flex items-center gap-1 rounded-full border border-muted-200 bg-white p-1 dark:border-muted-800 dark:bg-muted-950">
              <button type="button" onClick={() => changePage(currentPage - 1)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-muted-500 transition-all duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100">
                <react_2.Icon width={16} height={16} icon="lucide:chevron-left"/>
              </button>
              {pages.map((page, i) => (<button type="button" key={i} className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none  p-0 transition-all duration-300 ${currentPage == page
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                : "bg-transparent text-muted-500 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"}`} onClick={() => changePage(page)}>
                  <span className="text-[.9rem]">{page}</span>
                </button>))}
              <button onClick={() => changePage(currentPage + 1)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-muted-500 transition-all duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100">
                <react_2.Icon width={16} height={16} icon="lucide:chevron-right"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>);
};
const FuturesMarkets = (0, react_1.memo)(FuturesMarketsBase);
exports.default = FuturesMarkets;
