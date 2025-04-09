"use client";
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
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const api_1 = __importStar(require("@/utils/api"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const MashImage_1 = require("@/components/elements/MashImage");
const link_1 = __importDefault(require("next/link"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const dashboard_1 = require("@/stores/dashboard");
const tab_1 = require("@/components/elements/base/tab");
const lodash_1 = require("lodash");
const ecommerce_1 = require("@/stores/user/ecommerce");
const ProductReview_1 = require("@/components/pages/user/store/product/ProductReview");
const ProductDetails_1 = require("@/components/pages/user/store/product/ProductDetails");
const wallet_1 = require("@/stores/user/wallet");
const next_i18next_1 = require("next-i18next");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const sonner_1 = require("sonner");
const ShippingAddressModal_1 = __importDefault(require("@/components/pages/ecommerce/ShippingAddressModal"));
const ProductPage = ({ product, error }) => {
    var _a, _b;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const [amount, setAmount] = (0, react_1.useState)(1);
    const [discount, setDiscount] = (0, react_1.useState)(null);
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const { wishlist, fetchWishlist, addToWishlist, removeFromWishlist, wishlistFetched, } = (0, ecommerce_1.useEcommerceStore)();
    const { wallet, fetchWallet } = (0, wallet_1.useWalletStore)();
    const [mainTab, setMainTab] = (0, react_1.useState)("DESCRIPTION");
    const [showShippingModal, setShowShippingModal] = (0, react_1.useState)(false);
    const [shippingAddress, setShippingAddress] = (0, react_1.useState)({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });
    const tabs = [
        { value: "DESCRIPTION", label: "Description" },
        { value: "REVIEWS", label: "Reviews" },
    ];
    (0, react_1.useEffect)(() => {
        if (!error && router.isReady && !wishlistFetched) {
            fetchWishlist();
        }
    }, [error, router.isReady, wishlistFetched]);
    const fetchWalletData = async () => {
        await fetchWallet(product.walletType, product.currency);
    };
    (0, react_1.useEffect)(() => {
        if (!error && !wallet) {
            fetchWalletData();
        }
    }, [error, wallet]);
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
    const handleDiscount = async (code) => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/ecommerce/discount/${product === null || product === void 0 ? void 0 : product.id}`,
            method: "POST",
            body: { code },
        });
        if (!error) {
            setDiscount(data);
        }
    };
    const debouncedDiscount = (0, lodash_1.debounce)(handleDiscount, 500);
    const handlePurchase = async () => {
        var _a, _b, _c;
        if (getSetting("ecommerceRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            await router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to purchase this product"));
            return;
        }
        if ((product === null || product === void 0 ? void 0 : product.type) !== "DOWNLOADABLE") {
            setShowShippingModal(true);
        }
        else {
            await finalizePurchase();
        }
    };
    const finalizePurchase = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/ecommerce/order`,
            method: "POST",
            body: {
                productId: product === null || product === void 0 ? void 0 : product.id,
                discountId: discount === null || discount === void 0 ? void 0 : discount.id,
                amount,
                shippingAddress: (product === null || product === void 0 ? void 0 : product.type) !== "DOWNLOADABLE" ? shippingAddress : undefined,
            },
        });
        if (!error) {
            if (product)
                await fetchWallet(product.walletType, product.currency);
            router.push(`/user/store/${data.id}`);
        }
    };
    const handleWishlistToggle = (product) => {
        if (wishlist.find((item) => item.id === product.id)) {
            removeFromWishlist(product.id);
        }
        else {
            addToWishlist(product);
        }
    };
    return (<Default_1.default title={`${product.name}`} color="muted">
      <main>
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
          <h2 className="text-2xl">
            <span className="text-primary-500">{product.name}</span>{" "}
            <span className="text-muted-800 dark:text-muted-200">
              {t("Details")}
            </span>
          </h2>
          <BackButton_1.BackButton href={`/store/${product.category.slug}`}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-5">
            <div className="relative h-[400px]">
              <MashImage_1.MashImage src={(product === null || product === void 0 ? void 0 : product.image) || "/img/placeholder.svg"} fill alt={(product === null || product === void 0 ? void 0 : product.name) || "Product Image"} className="rounded-lg object-cover h-[400px] w-full"/>
              {profile && (<div className="absolute top-5 right-5">
                  <IconButton_1.default size={"sm"} onClick={() => handleWishlistToggle(product)} color={wishlist.find((item) => item.id === (product === null || product === void 0 ? void 0 : product.id))
                ? "danger"
                : "muted"} variant={"pastel"}>
                    <react_2.Icon icon="mdi:heart" className={`h-5 w-5 ${wishlist.find((item) => item.id === (product === null || product === void 0 ? void 0 : product.id))
                ? "text-danger-500"
                : "text-muted-300"}`}/>
                  </IconButton_1.default>
                </div>)}
            </div>
            <div className="flex gap-2 border-b border-muted-200 dark:border-muted-800">
              {tabs.map((tab) => (<tab_1.Tab key={tab.value} value={tab.value} label={tab.label} tab={mainTab} setTab={setMainTab} color="primary"/>))}
            </div>
            <div className="w-full flex flex-col h-full">
              <div className="flex-1">
                {mainTab === "DESCRIPTION" ? (<Card_1.default className="p-5" color="contrast">
                    <div className="prose dark:prose-dark" dangerouslySetInnerHTML={{ __html: product.description }}/>
                  </Card_1.default>) : (<ProductReview_1.ProductReview />)}
              </div>
            </div>
          </div>
          <div className="col-span-1 space-y-5">
            <ProductDetails_1.ProductDetails product={product} categoryName={product.category.name}/>
            <Card_1.default className="text-muted-800 dark:text-muted-200 flex flex-col justify-between text-sm" color="contrast">
              <div className="w-full">
                <h3 className="text-md font-semibold px-5 py-3">
                  {t("Purchase")}
                </h3>
                <ul className="flex flex-col gap-1">
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700 px-5 pb-1">
                    <p className="text-muted-500 dark:text-muted-300">
                      {t("Balance")}
                    </p>
                    <span className="flex">
                      {(wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0} {product === null || product === void 0 ? void 0 : product.currency}
                      <link_1.default href={`/user/wallet/deposit`}>
                        <react_2.Icon icon="ei:plus" className="h-5 w-5 text-success-500"/>
                      </link_1.default>
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700 px-5 pb-1">
                    <p className="text-muted-500 dark:text-muted-300">
                      {t("Discount")}
                    </p>
                    <span>{(_a = discount === null || discount === void 0 ? void 0 : discount.percentage) !== null && _a !== void 0 ? _a : 0}%</span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700 px-5 pb-1">
                    <p className="text-muted-500 dark:text-muted-300">
                      {t("Total to Pay")}
                    </p>
                    <span>
                      {product &&
            (product === null || product === void 0 ? void 0 : product.price) -
                ((product === null || product === void 0 ? void 0 : product.price) * ((_b = discount === null || discount === void 0 ? void 0 : discount.percentage) !== null && _b !== void 0 ? _b : 0)) /
                    100}{" "}
                      {product === null || product === void 0 ? void 0 : product.currency}
                    </span>
                  </li>
                </ul>
                {(product === null || product === void 0 ? void 0 : product.type) !== "DOWNLOADABLE" && (<div className="pt-4 px-5">
                    <Input_1.default type="number" label={t("Amount")} placeholder={t("Enter amount")} value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} min={1} max={product === null || product === void 0 ? void 0 : product.inventoryQuantity} disabled={!wallet}/>
                  </div>)}
                <div className="pt-4 px-5">
                  <Input_1.default type="text" label={t("Discount Code")} placeholder={t("Enter discount code")} onChange={(e) => {
            debouncedDiscount(e.target.value);
        }}/>
                </div>
                <div className="pb-5 px-5">
                  <Button_1.default type="button" shape="rounded-sm" color="primary" className="w-full mt-4" onClick={() => handlePurchase()} disabled={!wallet ||
            !amount ||
            amount === 0 ||
            (product ? amount > (product === null || product === void 0 ? void 0 : product.inventoryQuantity) : false) ||
            (product
                ? product.price -
                    (product.price * ((discount === null || discount === void 0 ? void 0 : discount.percentage) || 0)) /
                        100 >
                    (wallet === null || wallet === void 0 ? void 0 : wallet.balance)
                : false)}>
                    {t("Purchase")}
                  </Button_1.default>
                </div>
              </div>
            </Card_1.default>
          </div>
        </div>
      </main>
      <ShippingAddressModal_1.default open={showShippingModal} onClose={() => setShowShippingModal(false)} onSubmit={() => {
            setShowShippingModal(false);
            finalizePurchase();
        }} address={shippingAddress} setAddress={setShippingAddress}/>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    const { productName } = context.params;
    try {
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/ext/ecommerce/product/${productName}`,
        });
        if (error) {
            return {
                props: {
                    error: error,
                },
            };
        }
        return {
            props: {
                product: data,
            },
        };
    }
    catch (error) {
        console.error("Error fetching product:", error);
        return {
            props: {
                error: `Error fetching product: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = ProductPage;
