"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const nft_1 = require("@/stores/nft");
const AutoplaySlider_1 = __importDefault(require("@/components/elements/base/slider/AutoplaySlider"));
const TrendingCollectionsCarousel = () => {
    const { trendingCollections } = (0, nft_1.useNftStore)();
    return (<AutoplaySlider_1.default containerStyles="w-full h-[300px] lg:h-[400px] px-16 mt-16 z-10">
      {trendingCollections === null || trendingCollections === void 0 ? void 0 : trendingCollections.map((collection, index) => (<div key={index} className="relative w-full h-full flex items-center justify-center">
          <div className={`relative z-9 rounded-lg shadow-xl overflow-hidden w-full flex items-center justify-between px-8 md:px-20 lg:px-32 xl:px-48 py-12 h-[300px] lg:h-[400px]`} style={{
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.0)), url(${collection.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {collection.name}
              </h2>
              <p className="text-white mb-4">{collection.description}</p>
            </div>
          </div>
        </div>))}
    </AutoplaySlider_1.default>);
};
exports.default = TrendingCollectionsCarousel;
