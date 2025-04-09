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
const ActivityTab_1 = __importDefault(require("../../collection/tabs/ActivityTab"));
const tabs = ["Description", "Details", "Activity"];
const AssetDetailsTabs = ({ collection, asset, }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)("Description");
    return (<div className="bg-muted-100 dark:bg-muted-800 p-4 rounded-lg shadow-md">
      <div className="flex space-x-4 border-b border-muted-200 dark:border-muted-700 mb-4">
        {tabs.map((tab) => (<button key={tab} className={`px-4 py-2 font-medium ${activeTab === tab
                ? "border-b-2 border-purple-500 text-muted-900 dark:text-white"
                : "text-muted-500"}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>))}
      </div>

      {/* Tab Content */}
      {activeTab === "Description" && (<div>
          <p className="text-muted-700 dark:text-muted-300">
            {collection.description}
          </p>
        </div>)}

      {activeTab === "Details" && (<div className="space-y-4">
          <ul className="space-y-2 text-muted-700 dark:text-muted-300">
            <li>
              <strong>Index:</strong> #{asset.index}
            </li>
            <li>
              <strong>Token ID:</strong> {asset.id}
            </li>
            <li>
              <strong>Royalties:</strong> {asset.royalty}%
            </li>
          </ul>
        </div>)}

      {activeTab === "Activity" && <ActivityTab_1.default id={asset.id} type="asset"/>}
    </div>);
};
exports.default = AssetDetailsTabs;
