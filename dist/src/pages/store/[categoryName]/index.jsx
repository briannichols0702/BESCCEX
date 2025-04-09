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
const Default_1 = __importDefault(require("@/layouts/Default"));
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const MashImage_1 = require("@/components/elements/MashImage");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const ecommerce_1 = require("@/stores/user/ecommerce");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const dashboard_1 = require("@/stores/dashboard");
const api_1 = require("@/utils/api");
const router_1 = require("next/router");
const CategoryPage = ({ category, error }) => {
    var _a, _b;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [displayLimit, setDisplayLimit] = (0, react_1.useState)(9);
    const router = (0, router_1.useRouter)();
    const { wishlist, fetchWishlist, addToWishlist, removeFromWishlist, wishlistFetched, } = (0, ecommerce_1.useEcommerceStore)();
    (0, react_1.useEffect)(() => {
        if (router.isReady && !wishlistFetched) {
            fetchWishlist();
        }
    }, [router.isReady, wishlistFetched]);
    const loadMore = () => {
        setDisplayLimit(displayLimit + 9);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleWishlistToggle = (product) => {
        if (wishlist.find((item) => item.id === product.id)) {
            removeFromWishlist(product.id);
        }
        else {
            addToWishlist(product);
        }
    };
    if (error) {
        return (<Default_1.default title={t("Error")}>
        <div className="text-center my-16">
          <h2 className="text-xl text-danger-500">{t("Error")}</h2>
          <p className="text-muted mb-5">{t(error)}</p>
          <link_1.default href="/store">
            <Button_1.default>{t("Go back to store")}</Button_1.default>
          </link_1.default>
        </div>
      </Default_1.default>);
    }
    const filteredProducts = ((_a = category === null || category === void 0 ? void 0 : category.products) === null || _a === void 0 ? void 0 : _a.length) > 0 &&
        (category === null || category === void 0 ? void 0 : category.products.slice(0, displayLimit).filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.shortDescription
                .toLowerCase()
                .includes(searchTerm.toLowerCase())));
    return (<Default_1.default title={`${category.name} Products`}>
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{category.name}</span>{" "}
          <span className="text-muted-800 dark:text-muted-200">
            {t("Products")}
          </span>
        </h2>

        <div className="flex gap-2 w-full sm:max-w-xs text-end">
          <Input_1.default type="text" placeholder={t("Search Products...")} value={searchTerm} onChange={handleSearchChange} icon={"mdi:magnify"}/>
          <BackButton_1.BackButton href={`/store`}/>
        </div>
      </div>

      <div className="relative my-5">
        <hr className="border-muted-200 dark:border-muted-700"/>
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm
            ? `${t("Matching")} "${searchTerm}"`
            : `${t("All Products")}`}
          </span>
        </span>
      </div>

      {filteredProducts && filteredProducts.length > 0 ? (<div className="grid gap-x-3 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => {
                var _a;
                return (<div key={product.id} className="relative group">
              <link_1.default href={`/store/${category.slug}/${product.slug}`}>
                <Card_1.default className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400" shadow="hover" color="contrast">
                  <div className="relative w-full h-[200px]">
                    <MashImage_1.MashImage src={product.image || "/img/placeholder.svg"} alt={product.slug} width={300} height={200} className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"/>
                    <div className="absolute top-1 left-1">
                      <Tag_1.default color="primary">{category.name}</Tag_1.default>
                    </div>
                  </div>
                  <div className="my-2">
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
              {profile && (<div className="absolute top-5 right-5">
                  <IconButton_1.default size={"sm"} onClick={() => handleWishlistToggle(product)} color={wishlist.find((item) => item.id === product.id)
                            ? "danger"
                            : "muted"} variant={"pastel"}>
                    <react_2.Icon icon="mdi:heart" className={`h-5 w-5 ${wishlist.find((item) => item.id === product.id)
                            ? "text-danger-500"
                            : "text-muted-300"}`}/>
                  </IconButton_1.default>
                </div>)}
            </div>);
            })}
        </div>) : (<div className="my-16 w-full text-center text-muted">
          <p>{t("Sorry, there are no products available in this category.")}</p>
        </div>)}

      {filteredProducts.length > 0 &&
            filteredProducts.length < ((_b = category === null || category === void 0 ? void 0 : category.products) === null || _b === void 0 ? void 0 : _b.length) && (<div className="my-16 flex items-center justify-center">
            <Button_1.default type="button" className="rounded-lg bg-default px-4 py-2 flex items-center gap-2" onClick={loadMore}>
              <react_2.Icon icon="ph:dots-nine-bold" className="h-4 w-4"/>
              <span>{t("Load more")}</span>
            </Button_1.default>
          </div>)}
    </Default_1.default>);
};
async function getServerSideProps(context) {
    const { categoryName } = context.params;
    try {
        const response = await (0, api_1.$serverFetch)(context, {
            url: `/api/ext/ecommerce/category/${categoryName}`,
        });
        if (!response.data) {
            return {
                props: {
                    error: "Category not found",
                },
            };
        }
        return {
            props: {
                category: response.data,
            },
        };
    }
    catch (error) {
        console.error("Error fetching category:", error);
        return {
            props: {
                error: `Error fetching category: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = CategoryPage;
