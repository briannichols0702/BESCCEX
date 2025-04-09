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
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importStar(require("react"));
const dashboard_1 = require("@/stores/dashboard");
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const ListWidgetItem_1 = __importDefault(require("@/components/widgets/ListWidgetItem"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const BarCode_1 = require("@/components/pages/user/store/order/BarCode");
const OrderRecipient_1 = require("@/components/pages/user/store/order/OrderRecipient");
const OrderShippingDetails_1 = require("@/components/pages/user/store/order/OrderShippingDetails");
const OrderShippingCost_1 = require("@/components/pages/user/store/order/OrderShippingCost");
const OrderDeliveryDate_1 = require("@/components/pages/user/store/order/OrderDeliveryDate");
const OrderProductList_1 = require("@/components/pages/user/store/order/OrderProductList");
const next_i18next_1 = require("next-i18next");
const OrderReceipt = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [order, setOrder] = (0, react_1.useState)(null);
    const fetchOrder = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/ecommerce/order/${id}`,
            silent: true,
        });
        if (!error) {
            setOrder(data);
        }
    };
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchOrder();
        }
    }, [router.isReady]);
    const handlePrint = () => {
        const printable = document.getElementById("printable");
        if (printable) {
            // Create a new style element
            const style = document.createElement("style");
            style.innerHTML = `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable, #printable * {
            visibility: visible;
          }
          #printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `;
            // Append the style to the document head
            document.head.appendChild(style);
            // Print the content of the printable element
            window.print();
            // Remove the style after printing
            document.head.removeChild(style);
        }
    };
    if (!order) {
        return (<div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <react_2.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
          <p className="text-xl text-primary-500">{t("Loading order...")}</p>
        </div>
      </div>);
    }
    return (<Default_1.default title={t("Receipt")} color="muted">
      <main>
        <div className="mb-6 flex w-full">
          <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="font-sans text-2xl font-light leading-tight text-muted-800 dark:text-muted-100">
                {t("Receipt")}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <BackButton_1.BackButton href={`/user/store`}/>
              <Button_1.default type="button" onClick={handlePrint} className="w-24">
                <react_2.Icon icon="mdi:printer" className="mr-2"/>
                {t("Print")}
              </Button_1.default>
            </div>
          </div>
        </div>

        <div id="printable" className="grid grid-cols-12 gap-6">
          <div className="col-span-12 ltablet:col-span-8 lg:col-span-8">
            <Card_1.default color="contrast" className="flex w-full flex-col p-8 font-sans">
              <div className="flex flex-row justify-between border-b border-muted-200 pb-6 dark:border-muted-800">
                <div className="mx-auto flex w-full flex-col">
                  <div className="flex flex-row">
                    <h3 className="text-xl">
                      <span className="block text-sm text-muted-400">
                        {t("PROOF OF DELIVERY")}
                      </span>
                      <span className="block text-base text-muted-800 dark:text-muted-100">
                        {t("Order")} {order.id}
                      </span>
                    </h3>
                  </div>
                  {order.shipping && <BarCode_1.BarCode id={id} date={order.createdAt}/>}
                </div>
                {!order.shipping && (<div className="brand">
                    <Tag_1.default color="warning" shape="rounded-sm" variant="pastel">
                      {t("PENDING")}
                    </Tag_1.default>
                  </div>)}
              </div>

              <div className="flex flex-col gap-5 pt-6">
                {order.products.some((product) => product.type === "PHYSICAL") ? (<OrderRecipient_1.OrderRecipient shippingAddress={order.shippingAddress}/>) : (<div className="flex flex-col">
                    <span className="mb-2 text-xs uppercase text-muted-400">
                      {t("Recipient")}
                    </span>
                    <ul className="text-muted-800">
                      <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
                        <div className="flex-1 p-2 text-muted-400">
                          {t("Name")}
                        </div>
                        <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
                          {profile === null || profile === void 0 ? void 0 : profile.firstName} {profile === null || profile === void 0 ? void 0 : profile.lastName}
                        </div>
                      </li>
                      <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
                        <div className="flex-1 p-2 text-muted-400">
                          {t("Email")}
                        </div>
                        <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
                          {profile === null || profile === void 0 ? void 0 : profile.email}
                        </div>
                      </li>
                    </ul>
                  </div>)}
                {order.shipping && (<OrderShippingDetails_1.OrderShippingDetails shipping={order.shipping}/>)}
              </div>
              {order.shipping && (<OrderShippingCost_1.OrderShippingCost shipping={order.shipping}/>)}
            </Card_1.default>
          </div>

          <div className="col-span-12 ltablet:col-span-4 lg:col-span-4">
            <Card_1.default shape="smooth" color="contrast">
              <div className="border-b-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
                <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
                  {t("Order Info")}
                </h4>

                <ul className="relative">
                  {order.shipping && (<OrderDeliveryDate_1.OrderDeliveryDate shipping={order.shipping}/>)}
                  <li>
                    <ListWidgetItem_1.default href="#" avatarSize="xs" avatar={<IconBox_1.default icon="ph:envelope-duotone" className="h-8! w-8! rounded-lg! bg-info-500/10" iconClasses="h-5! w-5! text-info-500"/>} title={t("Support Email")} text={process.env.NEXT_PUBLIC_APP_EMAIL || "Not available"} itemAction={<link_1.default href={`mailto:${process.env.NEXT_PUBLIC_APP_EMAIL}`} className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500">
                          <react_2.Icon icon="lucide:arrow-right"/>
                        </link_1.default>}/>
                  </li>
                </ul>
              </div>
              <div className="px-6 pt-6 pb-3">
                <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
                  {t("Products")}
                </h4>

                <ul className="inner-list">
                  <OrderProductList_1.OrderProductList products={order.products}/>
                </ul>
              </div>
            </Card_1.default>
          </div>
        </div>
      </main>
    </Default_1.default>);
};
exports.default = OrderReceipt;
