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
const dynamic_1 = __importDefault(require("next/dynamic"));
const Nav_1 = __importDefault(require("@/layouts/Nav"));
const nft_1 = require("@/stores/nft");
const api_1 = require("@/utils/api");
const index_module_css_1 = __importDefault(require("./index.module.css"));
const TrendingCollectionsSlider = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/nft/home/Trending"))));
const TopCollections = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/nft/home/Collections"))));
const FeaturedNftAssets = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/nft/home/FeaturedAssets"))));
const CreatorBanner = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/nft/home/CreatorBanner"))));
const Stats = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/nft/home/Features"))));
const NFTHomePage = ({ initialTrendingCollections, initialTopCollections, initialFeaturedAssets, }) => {
    const { setTrendingCollections, setTopCollections, setFeaturedAssets } = (0, nft_1.useNftStore)();
    (0, react_1.useEffect)(() => {
        setTrendingCollections(initialTrendingCollections);
        setTopCollections(initialTopCollections);
        setFeaturedAssets(initialFeaturedAssets);
    }, [
        initialTrendingCollections,
        initialTopCollections,
        initialFeaturedAssets,
    ]);
    return (<Nav_1.default horizontal>
      <div className={index_module_css_1.default.page}>
        {" "}
        {/* Apply the custom font class */}
        <TrendingCollectionsSlider />
        <TopCollections />
        <FeaturedNftAssets />
        <Stats />
        <CreatorBanner />
      </div>
    </Nav_1.default>);
};
async function getServerSideProps(context) {
    try {
        const [trendingResponse, topCollectionsResponse, featuredAssetsResponse] = await Promise.all([
            (0, api_1.$serverFetch)(context, { url: `/api/ext/nft/collection/trending` }),
            (0, api_1.$serverFetch)(context, { url: `/api/ext/nft/collection/top` }),
            (0, api_1.$serverFetch)(context, { url: `/api/ext/nft/asset/featured` }),
        ]);
        return {
            props: {
                initialTrendingCollections: trendingResponse.data || [],
                initialTopCollections: topCollectionsResponse.data || [],
                initialFeaturedAssets: featuredAssetsResponse.data || [],
            },
        };
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                initialTrendingCollections: [],
                initialTopCollections: [],
                initialFeaturedAssets: [],
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = NFTHomePage;
