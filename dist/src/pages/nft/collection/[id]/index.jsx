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
exports.getServerSideProps = void 0;
const react_1 = __importStar(require("react"));
const Nav_1 = __importDefault(require("@/layouts/Nav"));
const BannerSection_1 = __importDefault(require("@/components/pages/nft/collection/BannerSection"));
const Links_1 = __importDefault(require("@/components/pages/nft/collection/elements/Links"));
const InfoSection_1 = __importDefault(require("@/components/pages/nft/collection/InfoSection"));
const Tabs_1 = __importDefault(require("@/components/pages/nft/collection/Tabs"));
const api_1 = require("@/utils/api");
const nft_1 = require("@/stores/nft");
const AssetDetailModal_1 = __importDefault(require("@/components/pages/nft/modals/AssetDetailModal"));
const CollectionPage = ({ initialCollection }) => {
    // Zustand Store Actions and State
    const { collection, setCollection, selectedAssetIndex, closeModal, goToPrevAsset, goToNextAsset, assets, } = (0, nft_1.useNftStore)();
    // Set the initial collection data from server-side props
    (0, react_1.useEffect)(() => {
        if (initialCollection) {
            setCollection(initialCollection);
        }
    }, [initialCollection, setCollection]);
    return (<Nav_1.default horizontal color="muted">
      {collection ? (<div className="w-full">
          {/* Banner Section */}
          <BannerSection_1.default />

          {/* Social Links and Buttons */}
          <Links_1.default />

          {/* Collection Info Section */}
          <InfoSection_1.default />

          {/* Collection Tabs */}
          <Tabs_1.default />

          {/* Asset Modal */}
          {selectedAssetIndex !== null && (<AssetDetailModal_1.default asset={assets[selectedAssetIndex]} isVisible={selectedAssetIndex !== null} onClose={closeModal} onPrev={goToPrevAsset} onNext={goToNextAsset}/>)}
        </div>) : (<p className="text-center text-lg font-semibold">Loading...</p>)}
    </Nav_1.default>);
};
exports.default = CollectionPage;
// Server-side data fetching
const getServerSideProps = async (context) => {
    const { id } = context.params;
    try {
        const collectionResponse = await (0, api_1.$serverFetch)(context, {
            url: `/api/ext/nft/collection/${id}`,
        });
        return {
            props: {
                initialCollection: collectionResponse.data || null,
            },
        };
    }
    catch (error) {
        console.error("Error fetching collection data:", error);
        return {
            props: {
                initialCollection: null,
            },
        };
    }
};
exports.getServerSideProps = getServerSideProps;
