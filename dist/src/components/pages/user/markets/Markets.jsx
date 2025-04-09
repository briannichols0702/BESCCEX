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
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
const shallow_1 = require("zustand/shallow");
const dashboard_1 = require("@/stores/dashboard");
const market_1 = __importDefault(require("@/stores/trade/market"));
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const api_1 = __importDefault(require("@/utils/api"));
const market_2 = require("@/utils/market");
const MarketsToolbar_1 = __importDefault(require("./MarketsToolbar"));
const MarketsTable_1 = __importDefault(require("./MarketsTable"));
const MarketsPagination_1 = __importDefault(require("./MarketsPagination"));
const MarketsBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { isDark, hasExtension, extensions } = (0, dashboard_1.useDashboardStore)();
    const { marketData, fetchData, setSearchQuery: setStoreSearchQuery, getPrecisionBySymbol, setWithEco, } = (0, market_1.default)((state) => state, shallow_1.shallow);
    const { createConnection, subscribe, unsubscribe, addMessageHandler, removeMessageHandler, } = (0, ws_1.default)();
    const [baseItems, setBaseItems] = (0, react_1.useState)([]); // Base data including ticker updates
    const [items, setItems] = (0, react_1.useState)([]);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)("");
    const [pages, setPages] = (0, react_1.useState)([]);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [perPage, setPerPage] = (0, react_1.useState)(25);
    const [sorted, setSorted] = (0, react_1.useState)({
        field: "",
        rule: "asc",
    });
    const [pagination, setPagination] = (0, react_1.useState)({
        total: 0,
        lastPage: 0,
        currentPage: 1,
        from: 1,
        to: 25,
    });
    const [tickersFetched, setTickersFetched] = (0, react_1.useState)(false);
    const [tickersConnected, setTickersConnected] = (0, react_1.useState)(false);
    const [ecoTickersConnected, setEcoTickersConnected] = (0, react_1.useState)(false);
    const debouncedFetchData = (0, react_1.useMemo)(() => (0, lodash_1.debounce)(fetchData, 100), [fetchData]);
    const parseToNumber = (0, react_1.useCallback)((value) => {
        const parsedValue = typeof value === "number" ? value : parseFloat(value);
        return isNaN(parsedValue) ? 0 : parsedValue;
    }, []);
    const updateItem = (0, react_1.useCallback)((existingItem, update) => {
        const precision = getPrecisionBySymbol(existingItem.symbol) || {
            price: 8,
            amount: 8,
        };
        return {
            ...existingItem,
            price: update.last !== undefined
                ? parseToNumber(update.last).toFixed(precision.price)
                : parseToNumber(existingItem.price || 0).toFixed(precision.price),
            change: update.change !== undefined
                ? parseToNumber(update.change).toFixed(2)
                : parseToNumber(existingItem.change || 0).toFixed(2),
            baseVolume: update.baseVolume !== undefined
                ? (0, market_2.formatLargeNumber)(update.baseVolume, precision.amount)
                : (0, market_2.formatLargeNumber)(existingItem.baseVolume || 0, precision.amount),
            quoteVolume: update.quoteVolume !== undefined
                ? (0, market_2.formatLargeNumber)(update.quoteVolume, precision.price)
                : (0, market_2.formatLargeNumber)(existingItem.quoteVolume || 0, precision.price),
            high: update.high !== undefined ? update.high : existingItem.high,
            low: update.low !== undefined ? update.low : existingItem.low,
            percentage: update.percentage !== undefined
                ? update.percentage
                : existingItem.percentage,
        };
    }, [getPrecisionBySymbol, parseToNumber]);
    // Initialize baseItems from marketData
    (0, react_1.useEffect)(() => {
        setBaseItems(marketData);
    }, [marketData]);
    // Apply ticker updates to baseItems, not items
    const updateItemsFromTickers = (0, react_1.useCallback)((newData) => {
        setBaseItems((prevBaseItems) => {
            let updated = false;
            const nextBase = prevBaseItems.map((item) => {
                const dataUpdate = newData[item.symbol];
                if (dataUpdate) {
                    const updatedItem = updateItem(item, dataUpdate);
                    if (JSON.stringify(updatedItem) !== JSON.stringify(item)) {
                        updated = true;
                        return updatedItem;
                    }
                }
                return item;
            });
            return updated ? nextBase : prevBaseItems;
        });
    }, [updateItem]);
    const fetchTickers = (0, react_1.useCallback)(async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/exchange/ticker",
            silent: true,
        });
        if (!error && data) {
            updateItemsFromTickers(data);
        }
        setTickersFetched(true);
    }, [updateItemsFromTickers]);
    const debouncedFetchTickers = (0, react_1.useMemo)(() => (0, lodash_1.debounce)(fetchTickers, 100), [fetchTickers]);
    // Fetch initial data and tickers
    (0, react_1.useEffect)(() => {
        if (router.isReady && extensions) {
            setWithEco(hasExtension("ecosystem"));
            debouncedFetchData();
            debouncedFetchTickers();
        }
    }, [router.isReady, extensions]);
    // Initialize WebSocket connections for tickers
    (0, react_1.useEffect)(() => {
        if (tickersFetched) {
            createConnection("tickersConnection", `/api/exchange/ticker`, {
                onOpen: () => {
                    subscribe("tickersConnection", "tickers");
                },
            });
            setTickersConnected(true);
            if (hasExtension("ecosystem")) {
                createConnection("ecoTickersConnection", `/api/ext/ecosystem/ticker`, {
                    onOpen: () => {
                        subscribe("ecoTickersConnection", "tickers");
                    },
                });
                setEcoTickersConnected(true);
            }
            return () => {
                unsubscribe("tickersConnection", "tickers");
                if (hasExtension("ecosystem")) {
                    unsubscribe("ecoTickersConnection", "tickers");
                }
            };
        }
    }, [tickersFetched, createConnection, subscribe, unsubscribe, hasExtension]);
    const handleTickerMessage = (0, react_1.useCallback)((message) => {
        const { data } = message;
        if (data)
            updateItemsFromTickers(data);
    }, [updateItemsFromTickers]);
    const messageFilter = (0, react_1.useCallback)((message) => message.stream === "tickers", []);
    (0, react_1.useEffect)(() => {
        if (tickersConnected) {
            addMessageHandler("tickersConnection", handleTickerMessage, messageFilter);
            return () => {
                removeMessageHandler("tickersConnection", handleTickerMessage);
            };
        }
    }, [
        tickersConnected,
        addMessageHandler,
        removeMessageHandler,
        handleTickerMessage,
        messageFilter,
    ]);
    (0, react_1.useEffect)(() => {
        if (ecoTickersConnected) {
            addMessageHandler("ecoTickersConnection", handleTickerMessage, messageFilter);
            return () => {
                removeMessageHandler("ecoTickersConnection", handleTickerMessage);
            };
        }
    }, [
        ecoTickersConnected,
        addMessageHandler,
        removeMessageHandler,
        handleTickerMessage,
        messageFilter,
    ]);
    const compareOnKey = (0, react_1.useCallback)((key, rule) => {
        return (a, b) => {
            var _a, _b;
            const valueA = (_a = a[key]) !== null && _a !== void 0 ? _a : null;
            const valueB = (_b = b[key]) !== null && _b !== void 0 ? _b : null;
            if (typeof valueA === "string" && typeof valueB === "string") {
                return rule === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }
            if (typeof valueA === "number" && typeof valueB === "number") {
                return rule === "asc" ? valueA - valueB : valueB - valueA;
            }
            return 0;
        };
    }, []);
    // Derive items from baseItems, searchQuery, and sorted
    (0, react_1.useEffect)(() => {
        let newItems = [...baseItems];
        // Filter by search
        if (searchQuery) {
            newItems = newItems.filter((item) => item.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        // Sort if needed
        if (sorted.field) {
            newItems.sort(compareOnKey(sorted.field, sorted.rule));
        }
        setItems(newItems);
    }, [baseItems, searchQuery, sorted, compareOnKey]);
    const updatePagination = (0, react_1.useCallback)((totalItems, itemsPerPage, page) => {
        const lastPage = Math.ceil(totalItems / itemsPerPage);
        const from = (page - 1) * itemsPerPage + 1;
        const to = Math.min(page * itemsPerPage, totalItems);
        setPagination((prev) => {
            if (prev.total === totalItems &&
                prev.lastPage === lastPage &&
                prev.currentPage === page &&
                prev.from === from &&
                prev.to === to) {
                return prev;
            }
            return { total: totalItems, lastPage, currentPage: page, from, to };
        });
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const newPages = Array.from({ length: totalPages }, (_, i) => i + 1);
        setPages((prev) => JSON.stringify(prev) === JSON.stringify(newPages) ? prev : newPages);
    }, []);
    (0, react_1.useEffect)(() => {
        updatePagination(items.length, perPage, currentPage);
    }, [items.length, perPage, currentPage, updatePagination]);
    const changePage = (0, react_1.useCallback)((page) => {
        if (page >= 1 && page <= pagination.lastPage && page !== currentPage) {
            setCurrentPage(page);
        }
    }, [pagination.lastPage, currentPage]);
    const changePerPage = (0, react_1.useCallback)((newPerPage) => {
        if (newPerPage !== perPage) {
            setPerPage(newPerPage);
            setCurrentPage(1);
        }
    }, [perPage]);
    const sortData = (0, react_1.useCallback)((field, rule) => {
        setSorted({ field, rule });
        setCurrentPage(1);
    }, []);
    const search = (0, react_1.useCallback)((query) => {
        setSearchQuery(query);
        setStoreSearchQuery(query); // keep store in sync if needed
        setCurrentPage(1);
    }, [setStoreSearchQuery]);
    const handleNavigation = (0, react_1.useCallback)((symbol) => {
        router.push(`/trade/${symbol.replace("/", "_")}`);
    }, [router]);
    return (<main id="datatable">
      <MarketsToolbar_1.default t={t} onSearch={search}/>
      <MarketsTable_1.default t={t} items={items} pagination={pagination} perPage={perPage} sorted={sorted} sort={sortData} isDark={isDark} handleNavigation={handleNavigation}/>
      <MarketsPagination_1.default t={t} pagination={pagination} pages={pages} currentPage={currentPage} perPage={perPage} changePage={changePage} changePerPage={changePerPage}/>
    </main>);
};
exports.default = (0, react_1.memo)(MarketsBase);
