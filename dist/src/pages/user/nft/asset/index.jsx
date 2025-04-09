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
const api_1 = __importDefault(require("@/utils/api"));
const Nav_1 = __importDefault(require("@/layouts/Nav"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const PaginationControls_1 = __importDefault(require("@/components/pages/nft/collection/elements/PaginationControls"));
const Header_1 = __importDefault(require("@/components/pages/nft/collection/tabs/asset/table/Header"));
const List_1 = __importDefault(require("@/components/pages/nft/collection/tabs/asset/table/List"));
const Grid_1 = __importDefault(require("@/components/pages/nft/collection/tabs/asset/table/Grid"));
const AssetPage = () => {
    const [assets, setAssets] = (0, react_1.useState)([]);
    const [search, setSearch] = (0, react_1.useState)("");
    const [sortState, setSortState] = (0, react_1.useState)({
        field: "name",
        rule: "asc",
    });
    const [minPrice, setMinPrice] = (0, react_1.useState)(undefined);
    const [maxPrice, setMaxPrice] = (0, react_1.useState)(undefined);
    const [viewMode, setViewMode] = (0, react_1.useState)("list");
    const [pagination, setPagination] = (0, react_1.useState)({
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
    });
    const fetchAssets = async () => {
        const params = {};
        if (search.trim())
            params.search = search.trim();
        if (sortState.field)
            params.sortBy = sortState.field;
        if (sortState.rule)
            params.order = sortState.rule;
        if (minPrice !== undefined)
            params.minPrice = minPrice;
        if (maxPrice !== undefined)
            params.maxPrice = maxPrice;
        params.limit = pagination.perPage;
        params.offset = (pagination.currentPage - 1) * pagination.perPage;
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/nft/user/asset`,
            params,
            silent: true,
        });
        if (!error) {
            setAssets(data);
            setPagination((prev) => ({ ...prev, totalItems: data.length }));
        }
    };
    (0, react_1.useEffect)(() => {
        fetchAssets();
    }, [
        search,
        sortState,
        minPrice,
        maxPrice,
        pagination.currentPage,
        pagination.perPage,
    ]);
    return (<Nav_1.default title="User NFT Assets" horizontal color="muted">
      <div className="p-8">
        {/* Search and Filters Row */}
        <div className="flex items-end justify-between mb-4">
          {/* Search Bar */}
          <div className="w-64">
            <Input_1.default type="text" placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)} icon="mdi:magnify"/>
          </div>

          <div className="flex items-end gap-4">
            {/* Filters */}
            <div className="flex space-x-4 text-muted-400 items-end">
              <Input_1.default type="number" placeholder="Min. value" value={minPrice !== undefined ? minPrice : ""} onChange={(e) => setMinPrice(Number(e.target.value))}/>
              <Input_1.default type="number" placeholder="Max. value" value={maxPrice !== undefined ? maxPrice : ""} onChange={(e) => setMaxPrice(Number(e.target.value))}/>
              <Tooltip_1.Tooltip content="Filter">
                <IconButton_1.default onClick={fetchAssets}>
                  <react_2.Icon icon="mdi:filter"/>
                </IconButton_1.default>
              </Tooltip_1.Tooltip>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 border-s ps-4 border-muted-200 dark:border-muted-800">
              <Tooltip_1.Tooltip content="List View">
                <IconButton_1.default onClick={() => setViewMode("list")} color={viewMode === "list" ? "purple" : "muted"}>
                  <react_2.Icon icon="stash:list-ul"/>
                </IconButton_1.default>
              </Tooltip_1.Tooltip>

              <Tooltip_1.Tooltip content="Grid View">
                <IconButton_1.default onClick={() => setViewMode("grid")} color={viewMode === "grid" ? "purple" : "muted"}>
                  <react_2.Icon icon="bitcoin-icons:grid-filled"/>
                </IconButton_1.default>
              </Tooltip_1.Tooltip>
            </div>
          </div>
        </div>

        {/* Asset List Table with Sortable Headers */}
        <div className="w-full text-muted-300">
          {viewMode === "list" && (<Header_1.default sortState={sortState} setSortState={setSortState}/>)}

          <div className={viewMode === "grid" ? "grid grid-cols-4 gap-6" : ""}>
            {assets.map((asset, index) => viewMode === "list" ? (<List_1.default key={index} asset={asset} chain="ETH"/>) : (<Grid_1.default key={index} asset={asset}/>))}
          </div>
        </div>

        {/* Pagination Controls */}
        <PaginationControls_1.default pagination={pagination} setPagination={setPagination}/>
      </div>
    </Nav_1.default>);
};
exports.default = AssetPage;
