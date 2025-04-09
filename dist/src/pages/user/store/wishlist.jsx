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
// pages/user/wishlist.tsx
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const ecommerce_1 = require("@/stores/user/ecommerce");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const react_2 = require("@iconify/react");
const MashImage_1 = require("@/components/elements/MashImage");
const link_1 = __importDefault(require("next/link"));
const next_i18next_1 = require("next-i18next");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const WishlistPage = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { wishlist, fetchWishlist, removeFromWishlist } = (0, ecommerce_1.useEcommerceStore)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        fetchWishlist();
    }, []);
    const handleRemoveFromWishlist = (productId) => {
        removeFromWishlist(productId);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredProducts = (wishlist &&
        wishlist.length > 0 &&
        wishlist.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.shortDescription
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))) ||
        [];
    return (<Default_1.default title={t("Wishlist")} color="muted">
      <main>
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
          <h2 className="text-2xl">
            <span className="text-primary-500">{t("Your Wishlist")}</span>{" "}
            <span className="text-muted-800 dark:text-muted-200">
              {t("Products")}
            </span>
          </h2>

          <div className="flex gap-2 w-full sm:max-w-xs text-end">
            <Input_1.default type="text" placeholder={t("Search Products...")} value={searchTerm} onChange={handleSearchChange} icon={"mdi:magnify"}/>
            <BackButton_1.BackButton href={"/store"}>{t("Back to Store")}</BackButton_1.BackButton>
          </div>
        </div>

        {filteredProducts.length > 0 ? (<div className="grid gap-x-3 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
            {filteredProducts.map((product) => {
                var _a;
                return (<div key={product.id} className="relative group">
                <link_1.default href={`/store/${product.category.slug}/${product.slug.replace(/ /g, "-")}`}>
                  <Card_1.default className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400" color="contrast">
                    <div className="relative w-full h-[200px]">
                      <MashImage_1.MashImage src={product.image || "/img/placeholder.svg"} alt={product.name} width={300} height={200} className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"/>
                      <div className="absolute top-1 left-1">
                        <Tag_1.default color="primary">{product.category.name}</Tag_1.default>
                      </div>
                    </div>
                    <div className="mb-2">
                      <h4 className="text-muted-800 dark:text-muted-100 font-medium">
                        {product.name}
                      </h4>
                      <p className="text-muted-500 dark:text-muted-400 text-xs">
                        {((_a = product.shortDescription) === null || _a === void 0 ? void 0 : _a.length) > 100
                        ? product.shortDescription.slice(0, 100) + "..."
                        : product.shortDescription}
                      </p>
                    </div>
                    <div className="divide-muted-200 dark:divide-muted-700 flex items-center justify-between">
                      <div className="pe-4">
                        <span className="text-muted-800 dark:text-muted-100 font-bold text-md">
                          {product.price} {product.currency}
                        </span>
                      </div>
                      <Tag_1.default shape="full" className="flex items-center">
                        <span>{t("Rating")}</span>
                        <react_2.Icon icon="uiw:star-on" className={`h-3 w-3 text-warning-500 ${product.rating === 0 ? "grayscale" : ""}`}/>
                        <span className="text-muted-400 text-xs">
                          {product.rating.toFixed(1)} ({product.reviewsCount})
                        </span>
                      </Tag_1.default>
                    </div>
                  </Card_1.default>
                </link_1.default>
                <div className="absolute top-5 right-5">
                  <IconButton_1.default size={"sm"} onClick={() => handleRemoveFromWishlist(product.id)} color={"danger"} variant={"pastel"}>
                    <react_2.Icon icon="mdi:heart" className="h-5 w-5 text-danger-500"/>
                  </IconButton_1.default>
                </div>
              </div>);
            })}
          </div>) : (<div className="my-16 w-full text-center text-muted">
            <p>{t("Your wishlist is currently empty.")}</p>
          </div>)}
      </main>
    </Default_1.default>);
};
exports.default = WishlistPage;
