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
// pages/shop/index.tsx
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const ecommerce_1 = require("@/stores/user/ecommerce");
const dashboard_1 = require("@/stores/dashboard");
const api_1 = require("@/utils/api");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
const ShopHeading_1 = __importDefault(require("@/components/pages/ecommerce/store/ShopHeading"));
const CategoriesCarousel_1 = __importDefault(require("@/components/pages/ecommerce/store/CategoriesCarousel"));
const ProductsGrid_1 = __importDefault(require("@/components/pages/ecommerce/store/ProductsGrid"));
const Shop = ({ categories, error }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const { wishlist, fetchWishlist, addToWishlist, removeFromWishlist, wishlistFetched, } = (0, ecommerce_1.useEcommerceStore)();
    const [displayLimit, setDisplayLimit] = (0, react_1.useState)(9);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        if (router.isReady && !wishlistFetched) {
            fetchWishlist();
        }
    }, [router.isReady, wishlistFetched]);
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const loadMore = () => {
        setDisplayLimit(displayLimit + 9);
    };
    const handleWishlistToggle = (product) => {
        if (wishlist.find((item) => item.id === product.id)) {
            removeFromWishlist(product.id);
        }
        else {
            addToWishlist(product);
        }
    };
    // Flatten all categories and their products
    const allCategoriesProducts = (categories === null || categories === void 0 ? void 0 : categories.length)
        ? categories.flatMap((category) => category.products.map((product) => ({
            ...product,
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
            },
        })))
        : [];
    // Filter products based on search term
    const filteredProducts = allCategoriesProducts
        .filter((product) => {
        var _a, _b;
        return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ((_b = (_a = product.shortDescription) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(searchTerm.toLowerCase()));
    })
        .slice(0, displayLimit);
    return (<Default_1.default title={t("Shop")}>
      <ShopHeading_1.default allCategoriesProducts={allCategoriesProducts} profile={profile} t={t}/>

      {categories.length > 0 && (<CategoriesCarousel_1.default categories={categories} t={t}/>)}

      <ProductsGrid_1.default filteredProducts={filteredProducts} allCategoriesProducts={allCategoriesProducts} searchTerm={searchTerm} handleSearchChange={handleSearchChange} loadMore={loadMore} wishlist={wishlist} handleWishlistToggle={handleWishlistToggle} profile={profile} t={t} capitalize={lodash_1.capitalize}/>

      <Faq_1.Faq category="ECOMMERCE"/>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    try {
        const response = await (0, api_1.$serverFetch)(context, {
            url: `/api/ext/ecommerce/category`,
        });
        if (!response.data) {
            return {
                props: {
                    error: "Categories not found",
                },
            };
        }
        return {
            props: {
                categories: response.data,
            },
        };
    }
    catch (error) {
        return {
            props: {
                error: `Error fetching categories: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = Shop;
