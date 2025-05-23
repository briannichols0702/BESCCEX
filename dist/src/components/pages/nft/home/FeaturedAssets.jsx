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
const nft_1 = require("@/stores/nft");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const react_3 = require("swiper/react");
const modules_1 = require("swiper/modules");
require("swiper/css");
require("swiper/css/navigation");
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const FeaturedNftAssets = () => {
    const { featuredAssets } = (0, nft_1.useNftStore)();
    const swiperRef = (0, react_1.useRef)(null);
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    // Custom navigation button to move the slider
    const handleSlideNext = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideNext();
        }
    };
    return (<div className="w-full px-4 md:px-16 py-12 relative z-9">
      {/* Gradient Backgrounds */}
      <div className="absolute z-[-1] h-[400px] w-[700px] rounded-full opacity-50 blur-[80px] [transform:translate3d(0,0,0)] dark:opacity-100 right-[-400px] top-[-300px]">
        <div className="h-full w-full bg-linear-to-l from-purple-600 via-purple-500 to-transparent"></div>
      </div>

      <div className="absolute z-[-1] h-[400px] w-[700px] rounded-full opacity-50 blur-[80px] [transform:translate3d(0,0,0)] dark:opacity-100 left-[-400px] top-[-500px] hidden md:block">
        <div className="h-full w-full bg-linear-to-r from-indigo-600 via-indigo-500 to-transparent"></div>
      </div>
      {/* Header Section */}
      <div className="z-9 flex flex-col lg:flex-row justify-between items-center gap-10 mb-10 bg-muted-50 dark:bg-black border border-muted-200 dark:border-muted-700 py-16 px-8 md:px-16 lg:px-24 rounded-xl">
        {/* Left Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-3xl md:text-4xl font-bold text-muted-900 dark:text-muted-100">
            Every week, we feature some of our favorite items
          </h2>
          <p className="text-muted-600 dark:text-muted-400 mt-2">
            Collect your favorite items now!
          </p>
          {/* Buttons */}
          <div className="flex mt-6 gap-5 w-full">
            <div className="w-full">
              <ButtonLink_1.default href="/nft/marketplace" color={"primary"} className="w-full">
                Trade Now
              </ButtonLink_1.default>
            </div>
            <div className="w-full">
              <ButtonLink_1.default href="/nft/collections" color={"muted"} className="w-full">
                Explore Collections
              </ButtonLink_1.default>
            </div>
          </div>
        </div>

        {/* Right Section - Carousel */}
        <div className="relative w-full lg:w-2/3 flex items-center">
          {/* Swiper */}
          <react_3.Swiper ref={swiperRef} modules={[modules_1.Navigation, modules_1.Autoplay]} spaceBetween={20} slidesPerView={1} loop={true} autoplay={{ delay: 5000, disableOnInteraction: false }} breakpoints={{
            640: {
                slidesPerView: 1, // Small screens: 1 slide
            },
            768: {
                slidesPerView: 3, // Medium screens: 2 slides
            },
            1024: {
                slidesPerView: 2, // Large screens: 3 slides
            },
        }} className="w-full" onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}>
            {featuredAssets.map((asset) => (<react_3.SwiperSlide key={asset.id} className="w-full h-full min-w-72">
                <link_1.default href={`/nft/asset/${asset.id}`} className="block bg-muted-100 dark:bg-black rounded-xl overflow-hidden transition group border border-muted-100 dark:border-muted-900 hover:border-purple-500">
                  <div className="relative w-full h-[18rem] overflow-hidden">
                    <img src={asset.image} alt={asset.name} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"/>
                  </div>

                  <div className="relative p-4 group-hover:shadow-lg transition bg-muted-200 dark:bg-muted-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-muted-900 dark:text-white">
                          {asset.name}
                        </h3>
                        <p className="text-sm text-muted-600 dark:text-muted-400">
                          Rank:{" "}
                          <span className="font-medium">{asset.rank}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-600 dark:text-muted-400">
                          #{asset.index}
                        </p>
                        <span className="text-lg font-bold text-muted-900 dark:text-white">
                          {asset.price ? `${asset.price} ETH` : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 w-full h-full p-3 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <button className="w-full h-full px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md transition hover:bg-purple-600">
                        Buy now
                      </button>
                    </div>
                  </div>
                </link_1.default>
              </react_3.SwiperSlide>))}
          </react_3.Swiper>

          {/* Right Navigation Button */}
          <div className="hidden lg:block w-6 ps-3">
            {/* Show on medium screens and above */}
            <button onClick={handleSlideNext} className="bg-muted-200 dark:bg-muted-700 text-muted-800 dark:text-muted-100 rounded-full p-2 transition hover:bg-muted-300 dark:hover:bg-muted-600">
              <react_2.Icon icon="akar-icons:chevron-right" className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = FeaturedNftAssets;
