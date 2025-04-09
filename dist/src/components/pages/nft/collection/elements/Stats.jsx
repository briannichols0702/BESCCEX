"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const nft_1 = require("@/stores/nft");
const Stats = () => {
    var _a;
    // Retrieve the collection state from the Zustand store
    const collection = (0, nft_1.useNftStore)((state) => state.collection);
    if (!collection)
        return null;
    const stats = [
        {
            label: "Volume",
            value: collection.totalVolume
                ? `${collection.totalVolume} ${collection.chain}`
                : `0 ${collection.chain}`,
        },
        {
            label: "Floor Price",
            value: collection.floorPrice
                ? `${collection.floorPrice} ${collection.chain}`
                : `0 ${collection.chain}`,
        },
        { label: "Supply", value: ((_a = collection.nftAssets) === null || _a === void 0 ? void 0 : _a.length) || "0" },
        // { label: "Followers", value: collection.followers?.length || "0" },
        { label: "Holders", value: collection.holders || "0" },
    ];
    return (<div className="flex flex-wrap justify-end space-x-8 text-right mt-4">
      {stats.map((stat, index) => (<div key={index} className="flex flex-col">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {stat.label}
          </span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            {stat.value}
          </span>
        </div>))}
    </div>);
};
exports.default = Stats;
