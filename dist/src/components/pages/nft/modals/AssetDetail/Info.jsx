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
const UserInfo_1 = __importDefault(require("./UserInfo"));
const nft_1 = require("@/stores/nft");
const react_2 = require("@iconify/react");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const sonner_1 = require("sonner");
const AssetInfo = ({ asset, collection }) => {
    var _a;
    const { likeAsset, unlikeAsset, checkLikeStatus, openPurchaseModal } = (0, nft_1.useNftStore)();
    const [isLiked, setIsLiked] = (0, react_1.useState)((_a = asset === null || asset === void 0 ? void 0 : asset.isLiked) !== null && _a !== void 0 ? _a : null);
    (0, react_1.useEffect)(() => {
        var _a;
        const fetchLikeStatus = async () => {
            const liked = await checkLikeStatus(asset.id);
            setIsLiked(liked);
        };
        if (asset === null || asset === void 0 ? void 0 : asset.id) {
            setIsLiked((_a = asset.isLiked) !== null && _a !== void 0 ? _a : null);
            if (asset.isLiked === undefined) {
                fetchLikeStatus();
            }
        }
    }, [asset.id, asset.isLiked, checkLikeStatus]);
    const handleLikeToggle = async () => {
        if (isLiked) {
            await unlikeAsset(asset.id);
            setIsLiked(false);
        }
        else {
            await likeAsset(asset.id);
            setIsLiked(true);
        }
    };
    const handleShare = () => {
        const assetUrl = `${window.location.origin}/nft/collection/${collection.id}`;
        navigator.clipboard.writeText(assetUrl).then(() => {
            sonner_1.toast.success("Link copied to clipboard!");
        });
    };
    return (<div className="flex flex-col justify-center gap-10 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-muted-900 dark:text-white">
          {asset.name} #{asset.index}
        </h1>
        <div className="flex items-center gap-2">
          <IconButton_1.default onClick={handleLikeToggle} color="contrast">
            <react_2.Icon icon={isLiked ? "mdi:heart" : "mdi:heart-outline"} className={isLiked ? "text-red-500" : ""}/>
          </IconButton_1.default>
          <IconButton_1.default onClick={handleShare} color="contrast">
            <react_2.Icon icon="mdi:share-variant"/>
          </IconButton_1.default>
        </div>
      </div>

      <div className="rounded-lg bg-muted-100 dark:bg-muted-800 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-muted-800 dark:text-muted-300">
            Price
          </h2>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {asset.price} {asset.currency}
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => openPurchaseModal(asset)} className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600">
            Buy now
          </button>
          <button className="flex-1 px-4 py-3 bg-muted-200 dark:bg-muted-700 dark:text-white text-black rounded-lg shadow-md hover:bg-muted-300 dark:hover:bg-muted-600">
            Make offer
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <UserInfo_1.default label="Owned By" user={asset.owner}/>
        <UserInfo_1.default label="Created By" user={collection.creator}/>
      </div>
    </div>);
};
exports.default = AssetInfo;
