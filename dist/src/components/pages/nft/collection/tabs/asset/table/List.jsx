"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const date_fns_1 = require("date-fns");
const AssetListRow = ({ asset, chain }) => (<div className="grid grid-cols-5 gap-4 items-center py-3 border-b border-muted-200 dark:border-muted-800 hover:bg-muted-100 dark:hover:bg-muted-800 transition hover:border-muted-100 dark:hover:border-muted-800 cursor-pointer">
    {/* Asset Info */}
    <div className="col-span-2 flex items-center">
      <img src={asset.image} alt={asset.name} className="w-20 h-20 rounded-md mx-4"/>
      <div>
        <span className="text-lg font-semibold text-muted-800 dark:text-muted-200">
          {asset.name}
        </span>
        <span className="text-sm text-muted-500"> #{asset.index}</span>
      </div>
    </div>

    {/* Price */}
    <span className=" text-muted-800 dark:text-muted-200">
      {asset.price} {chain}
    </span>

    {/* Owner */}
    <span className="text-green-500">@{asset.owner.firstName}</span>

    {/* Listed Time (Time Ago Format) */}
    <span className="text-muted-500 dark:text-muted-400">
      {(0, date_fns_1.formatDistanceToNow)(new Date(asset.createdAt), { addSuffix: true })}
    </span>
  </div>);
exports.default = AssetListRow;
