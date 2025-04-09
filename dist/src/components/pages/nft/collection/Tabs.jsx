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
const AssetTab_1 = __importDefault(require("./tabs/AssetTab"));
const ActivityTab_1 = __importDefault(require("./tabs/ActivityTab"));
const AnalyticsTab_1 = __importDefault(require("./tabs/AnalyticsTab"));
const nft_1 = require("@/stores/nft");
const tabs = ["Collection", "Activity", "Offers", "Analytics"];
const CollectionTabs = () => {
    const [activeTab, setActiveTab] = (0, react_1.useState)("Collection");
    const { collection } = (0, nft_1.useNftStore)();
    return (<div className="w-full px-12 pb-12">
      <div className="flex border-b border-muted-200 dark:border-muted-800">
        {tabs.map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`text-lg px-6 py-3 font-medium ${activeTab === tab
                ? "text-muted-800 dark:text-muted-200 border-b-2 border-purple-500"
                : "text-muted-500"}`}>
            {tab}
          </button>))}
      </div>

      {activeTab === "Collection" && <AssetTab_1.default />}
      {activeTab === "Activity" && collection && (<ActivityTab_1.default id={collection.id} type="collection"/>)}
      {activeTab === "Offers" && <div>Offers Content</div>}
      {activeTab === "Analytics" && <AnalyticsTab_1.default />}
    </div>);
};
exports.default = CollectionTabs;
