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
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const nft_1 = require("@/stores/nft");
const sonner_1 = require("sonner");
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const SocialLinksAndButtons = () => {
    var _a, _b, _c, _d, _e, _f;
    const { collection, followCollection, unfollowCollection, checkFollowStatus, } = (0, nft_1.useNftStore)();
    const [isFollowing, setIsFollowing] = (0, react_1.useState)(null);
    const [hovering, setHovering] = (0, react_1.useState)(false);
    // Fetch the follow status when the component mounts
    (0, react_1.useEffect)(() => {
        const fetchFollowStatus = async () => {
            if (collection && collection.id) {
                const status = await checkFollowStatus(collection.id);
                setIsFollowing(status);
            }
        };
        fetchFollowStatus();
    }, [collection, checkFollowStatus]); // Dependency array updated to include `collection` instead of `collection.id`
    // Handle follow/unfollow toggle
    const handleFollowToggle = async () => {
        if (!collection || !collection.id)
            return;
        if (isFollowing) {
            await unfollowCollection(collection.id);
            setIsFollowing(false);
        }
        else {
            await followCollection(collection.id);
            setIsFollowing(true);
        }
    };
    const handleShare = () => {
        if (!collection)
            return;
        const assetUrl = `${window.location.origin}/nft/collection/${collection.id}`;
        navigator.clipboard.writeText(assetUrl).then(() => {
            sonner_1.toast.success("Link copied to clipboard!");
        });
    };
    // If collection is null, render empty state early on
    if (!collection) {
        return <div>Loading...</div>;
    }
    return (<div className="w-full flex justify-end items-center px-6 md:px-12 mt-4 gap-5">
      {/* Render Social Links */}
      {collection.links && Object.keys(collection.links).length > 0 && (<div className="flex gap-4 md:gap-6 border-e pe-4 border-muted-200 dark:border-muted-800">
          {((_a = collection.links) === null || _a === void 0 ? void 0 : _a.website) && (<Tooltip_1.Tooltip content="Website">
              <a href={collection.links.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <react_2.Icon icon="mdi:web"/>
              </a>
            </Tooltip_1.Tooltip>)}
          {((_b = collection.links) === null || _b === void 0 ? void 0 : _b.youtube) && (<Tooltip_1.Tooltip content="YouTube">
              <a href={collection.links.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <react_2.Icon icon="mdi:youtube"/>
              </a>
            </Tooltip_1.Tooltip>)}
          {((_c = collection.links) === null || _c === void 0 ? void 0 : _c.twitter) && (<Tooltip_1.Tooltip content="Twitter">
              <a href={collection.links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <react_2.Icon icon="mdi:twitter"/>
              </a>
            </Tooltip_1.Tooltip>)}
          {((_d = collection.links) === null || _d === void 0 ? void 0 : _d.instagram) && (<Tooltip_1.Tooltip content="Instagram">
              <a href={collection.links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <react_2.Icon icon="mdi:instagram"/>
              </a>
            </Tooltip_1.Tooltip>)}
          {((_e = collection.links) === null || _e === void 0 ? void 0 : _e.discord) && (<Tooltip_1.Tooltip content="Discord">
              <a href={collection.links.discord} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <react_2.Icon icon="mdi:discord"/>
              </a>
            </Tooltip_1.Tooltip>)}
          {((_f = collection.links) === null || _f === void 0 ? void 0 : _f.telegram) && (<Tooltip_1.Tooltip content="Telegram">
              <a href={collection.links.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <react_2.Icon icon="mdi:telegram"/>
              </a>
            </Tooltip_1.Tooltip>)}
        </div>)}

      {/* Follow and Share Buttons */}
      <div className="flex items-center space-x-4">
        <Button_1.default color={"contrast"} onClick={handleFollowToggle} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className="group flex items-center">
          <react_2.Icon icon={isFollowing ? "mdi:star" : "mdi:star-outline"} className={`w-5 h-5 me-1 ${isFollowing && hovering
            ? "text-red-500"
            : isFollowing
                ? "text-yellow-500"
                : "group-hover:text-yellow-500"}`}/>
          <span className={`text-sm ${isFollowing && hovering
            ? "text-red-500"
            : isFollowing
                ? "text-yellow-500"
                : "group-hover:text-yellow-500"}`}>
            {isFollowing && hovering
            ? "Unfollow"
            : isFollowing
                ? "Following"
                : "Follow"}
          </span>
        </Button_1.default>

        <Tooltip_1.Tooltip content="Share">
          <IconButton_1.default color={"contrast"} onClick={handleShare}>
            <react_2.Icon icon="mdi:share-variant"/>
          </IconButton_1.default>
        </Tooltip_1.Tooltip>
      </div>
    </div>);
};
exports.default = SocialLinksAndButtons;
