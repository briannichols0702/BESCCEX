"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ProfileImage_1 = __importDefault(require("./elements/ProfileImage"));
const nft_1 = require("@/stores/nft");
const BannerSection = () => {
    var _a;
    // Retrieve the collection state from the Zustand store
    const collection = (0, nft_1.useNftStore)((state) => state.collection);
    return (<div className="relative w-full h-[250px] md:h-[280px] bg-cover bg-center flex flex-col justify-end" style={{
            backgroundImage: `url(${(collection === null || collection === void 0 ? void 0 : collection.image) || "/default-banner.png"})`,
        }}>
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 to-transparent"></div>

      {/* Creator's Profile Image */}
      <ProfileImage_1.default avatar={(_a = collection === null || collection === void 0 ? void 0 : collection.creator) === null || _a === void 0 ? void 0 : _a.avatar}/>
    </div>);
};
exports.default = BannerSection;
