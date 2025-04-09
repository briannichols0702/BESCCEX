"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Header_1 = __importDefault(require("./table/Header"));
const List_1 = __importDefault(require("./table/List"));
const Grid_1 = __importDefault(require("./table/Grid"));
const nft_1 = require("@/stores/nft");
const AssetTable = ({ sortState, setSortState, chain, viewMode, }) => {
    const { assets, openModal } = (0, nft_1.useNftStore)();
    return (<div className="w-full text-muted-300">
      {viewMode === "list" && (<Header_1.default sortState={sortState} setSortState={setSortState}/>)}

      <div className={viewMode === "grid" ? "grid grid-cols-4 gap-6" : ""}>
        {assets.map((asset, index) => viewMode === "list" ? (<div key={index} onClick={() => openModal(index)}>
              <List_1.default asset={asset} chain={chain}/>
            </div>) : (<div key={index} onClick={() => openModal(index)}>
              <Grid_1.default asset={asset}/>
            </div>))}
      </div>
    </div>);
};
exports.default = AssetTable;
