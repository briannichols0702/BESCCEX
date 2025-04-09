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
const nft_1 = require("@/stores/nft");
const SearchBar_1 = __importDefault(require("./asset/SearchBar"));
const Filters_1 = __importDefault(require("./asset/Filters"));
const Table_1 = __importDefault(require("./asset/Table"));
const PaginationControls_1 = __importDefault(require("../elements/PaginationControls"));
const ViewToggle_1 = __importDefault(require("./asset/ViewToggle"));
const AssetTab = () => {
    const router = (0, router_1.useRouter)();
    const { id } = router.query; // Get `collectionId` from the URL
    const { assets, fetchAssets } = (0, nft_1.useNftStore)();
    // State for search, filters, view mode, and pagination
    const [search, setSearch] = (0, react_1.useState)("");
    const [listingType, setListingType] = (0, react_1.useState)("All");
    const [sortState, setSortState] = (0, react_1.useState)({
        field: "name", // Default sorted field
        rule: "asc", // Default sorting rule
    });
    const [minPrice, setMinPrice] = (0, react_1.useState)(undefined);
    const [maxPrice, setMaxPrice] = (0, react_1.useState)(undefined);
    const [chain, setChain] = (0, react_1.useState)(""); // Dynamic chain value
    const [pagination, setPagination] = (0, react_1.useState)({
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
    });
    const [viewMode, setViewMode] = (0, react_1.useState)("list"); // View mode state
    // Effect to fetch assets when component mounts or filters change
    (0, react_1.useEffect)(() => {
        if (!router.isReady || !id)
            return;
        // Prepare query parameters for fetching assets
        const fetchParams = {
            collectionId: id,
            search: search.trim() ? search : undefined, // Set search to `undefined` if empty
            sortBy: sortState.field ? sortState.field.toLowerCase() : undefined,
            order: sortState.rule || undefined,
            listingType: listingType !== "All" ? listingType : undefined,
            minPrice: minPrice !== undefined ? minPrice.toString() : undefined, // Convert to string
            maxPrice: maxPrice !== undefined ? maxPrice.toString() : undefined, // Convert to string
            limit: pagination.perPage,
            offset: (pagination.currentPage - 1) * pagination.perPage,
        };
        // Remove undefined values from params
        const validParams = {};
        for (const [key, value] of Object.entries(fetchParams)) {
            if (value !== undefined) {
                validParams[key] =
                    typeof value === "number" || typeof value === "boolean"
                        ? value
                        : String(value);
            }
        }
        // Make API call
        fetchAssets(validParams);
    }, [
        router.isReady,
        id,
        search, // Trigger fetch on `search` change
        sortState,
        listingType,
        minPrice,
        maxPrice,
        pagination.currentPage,
        pagination.perPage,
    ]);
    // Effect to calculate price range, set chain, and total items based on assets
    (0, react_1.useEffect)(() => {
        if (assets.length > 0) {
            const prices = assets.map((asset) => asset.price);
            setMinPrice(Math.min(...prices));
            setMaxPrice(Math.max(...prices));
            if (assets[0].collection.chain) {
                setChain(assets[0].collection.chain);
            }
        }
        setPagination((prev) => ({
            ...prev,
            totalItems: assets.length, // Update total items based on fetched assets
        }));
    }, [assets]);
    return (<div className="w-full py-4">
      {/* Search and Filters Row */}
      <div className="flex items-end justify-between mb-4">
        {/* Search Bar */}
        <SearchBar_1.default value={search} onChange={setSearch} placeholder={`Search by name or index`}/>
        <div className="flex items-end gap-4">
          {/* Sorting and Filters */}
          <Filters_1.default listingType={listingType} setListingType={setListingType} minPrice={minPrice} setMinPrice={setMinPrice} maxPrice={maxPrice} setMaxPrice={setMaxPrice} onFilter={() => fetchAssets({
            minPrice: minPrice !== undefined ? minPrice.toString() : "",
            maxPrice: maxPrice !== undefined ? maxPrice.toString() : "",
        })}/>

          {/* View Toggle */}
          <ViewToggle_1.default viewMode={viewMode} setViewMode={setViewMode}/>
        </div>
      </div>

      {/* Asset List Table or Grid */}
      <Table_1.default sortState={sortState} setSortState={setSortState} chain={chain} viewMode={viewMode}/>

      {/* Pagination Controls */}
      <PaginationControls_1.default pagination={pagination} setPagination={setPagination}/>
    </div>);
};
exports.default = AssetTab;
