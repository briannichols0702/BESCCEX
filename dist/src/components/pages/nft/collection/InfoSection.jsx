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
const Stats_1 = __importDefault(require("./elements/Stats"));
const nft_1 = require("@/stores/nft");
const CollectionInfoSection = () => {
    // Retrieve the collection state from the Zustand store
    const { collection } = (0, nft_1.useNftStore)();
    const [showMore, setShowMore] = (0, react_1.useState)(false);
    if (!collection)
        return null;
    return (<div className="px-6 md:px-12 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        {/* Collection Name */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {collection.name}
        </h1>

        {/* Collection Description */}
        <p className={`text-gray-700 dark:text-gray-300 ${!showMore ? "line-clamp-2" : ""}`}>
          {collection.description}
        </p>

        {/* Show More / Show Less Button */}
        {collection.description.length > 150 && (<button onClick={() => setShowMore(!showMore)} className="mt-2 text-sm text-green-500 hover:text-green-700">
            {showMore ? "Show less" : "Show more"}
          </button>)}
      </div>

      {/* Collection Stats Section */}
      <div className="w-full flex flex-col items-end">
        <Stats_1.default />
      </div>
    </div>);
};
exports.default = CollectionInfoSection;
``;
