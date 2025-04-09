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
const link_1 = __importDefault(require("next/link"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const PaginationControls_1 = __importDefault(require("@/components/pages/nft/collection/elements/PaginationControls"));
const SortableHeader_1 = require("@/components/pages/trade/markets/SortableHeader");
const CollectionPage = () => {
    const [collections, setCollections] = (0, react_1.useState)([]);
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
    const fetchCollections = async () => {
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
            url: `/api/ext/nft/user/collection`,
            params,
            silent: true,
        });
        if (!error) {
            setCollections(data);
            setPagination((prev) => ({ ...prev, totalItems: data.length }));
        }
    };
    (0, react_1.useEffect)(() => {
        fetchCollections();
    }, [
        search,
        sortState,
        minPrice,
        maxPrice,
        pagination.currentPage,
        pagination.perPage,
    ]);
    return (<Nav_1.default title="User NFT Collections" horizontal color="muted">
      <div className="p-8">
        {/* Search and Filters Row */}
        <div className="flex items-end justify-between mb-4">
          {/* Search Bar */}
          <div className="w-64">
            <Input_1.default type="text" placeholder="Search collections..." value={search} onChange={(e) => setSearch(e.target.value)} icon="mdi:magnify"/>
          </div>

          <div className="flex items-end gap-4">
            {/* Filters */}
            <div className="flex space-x-4 text-muted-400 items-end">
              <Input_1.default type="number" placeholder="Min. value" value={minPrice !== undefined ? minPrice : ""} onChange={(e) => setMinPrice(Number(e.target.value))}/>
              <Input_1.default type="number" placeholder="Max. value" value={maxPrice !== undefined ? maxPrice : ""} onChange={(e) => setMaxPrice(Number(e.target.value))}/>
              <Tooltip_1.Tooltip content="Filter">
                <IconButton_1.default onClick={fetchCollections}>
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

        {/* Collection List Table with Sortable Headers */}
        <div className="w-full text-muted-300">
          {viewMode === "list" && (<div className="grid grid-cols-6 gap-4 py-3 bg-muted-150 dark:bg-muted-900 rounded-lg text-muted-400 text-sm mb-1">
              <SortableHeader_1.SortableHeader field="name" title="Collection Name" sort={sortState} setSort={setSortState} className="col-span-2 ps-4 text-muted-700 dark:text-muted-200" size="sm"/>
              <SortableHeader_1.SortableHeader field="floorPrice" title="Floor Price" sort={sortState} setSort={setSortState} className="text-muted-700 dark:text-muted-200" size="sm"/>
              <SortableHeader_1.SortableHeader field="totalVolume" title="Volume" sort={sortState} setSort={setSortState} className="text-muted-700 dark:text-muted-200" size="sm"/>
              <SortableHeader_1.SortableHeader field="nftCount" title="NFT Count" sort={sortState} setSort={setSortState} className="text-muted-700 dark:text-muted-200" size="sm"/>
              <SortableHeader_1.SortableHeader field="createdAt" title="Created At" sort={sortState} setSort={setSortState} className="text-muted-700 dark:text-muted-200" size="sm"/>
            </div>)}

          <div className={viewMode === "grid" ? "grid grid-cols-4 gap-6" : ""}>
            {collections.map((collection, index) => viewMode === "list" ? (<div key={index} className="grid grid-cols-6 gap-4 items-center py-3 border-b border-muted-200 dark:border-muted-800 hover:bg-muted-100 dark:hover:bg-muted-800 transition hover:border-muted-100 dark:hover:border-muted-800 cursor-pointer">
                  <div className="col-span-2 flex items-center">
                    <img src={collection.image} alt={collection.name} className="w-20 h-20 rounded-md mx-4"/>
                    <div>
                      <span className="text-lg font-semibold text-muted-800 dark:text-muted-200">
                        {collection.name}
                      </span>
                    </div>
                  </div>
                  <span className=" text-muted-800 dark:text-muted-200">
                    {collection.floorPrice || "N/A"}
                  </span>
                  <span className="text-muted-800 dark:text-muted-200">
                    {collection.totalVolume || "N/A"}
                  </span>
                  <span className="text-muted-800 dark:text-muted-200">
                    {collection.nftCount || 0}
                  </span>
                  <span className="text-muted-800 dark:text-muted-200">
                    {new Date(collection.createdAt).toDateString() || "N/A"}
                  </span>
                </div>) : (<link_1.default key={index} href={`/nft/collection/${collection.id}`} className="block bg-muted-100 dark:bg-black rounded-xl overflow-hidden transition group border border-muted-200 dark:border-muted-900 hover:border-purple-500">
                  <div className="relative w-full h-[18rem] overflow-hidden">
                    <img src={collection.image} alt={collection.name} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"/>
                  </div>
                  <div className="relative p-4 group-hover:shadow-lg transition bg-muted-200 dark:bg-muted-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-muted-900 dark:text-white">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-muted-600 dark:text-muted-400">
                          Floor Price: {collection.floorPrice || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </link_1.default>))}
          </div>
        </div>

        {/* Pagination Controls */}
        <PaginationControls_1.default pagination={pagination} setPagination={setPagination}/>
      </div>
    </Nav_1.default>);
};
exports.default = CollectionPage;
