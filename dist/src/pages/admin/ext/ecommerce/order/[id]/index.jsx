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
exports.permission = void 0;
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const next_i18next_1 = require("next-i18next");
const api_1 = __importDefault(require("@/utils/api"));
const lodash_1 = require("lodash");
const router_1 = require("next/router");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const OrderShippingAddressDetails_1 = require("@/components/pages/user/store/order/OrderShippingAddressDetails");
const OrderShippingAddressInputs_1 = require("@/components/pages/user/store/order/OrderShippingAddressInputs");
const OrderShippingDetails_1 = require("@/components/pages/user/store/order/OrderShippingDetails");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const sonner_1 = require("sonner");
const OrderUserInfo_1 = __importDefault(require("@/components/pages/user/store/order/OrderUserInfo/OrderUserInfo"));
const OrderDownloadOptions_1 = __importDefault(require("@/components/pages/user/store/order/OrderDownloadOptions/OrderDownloadOptions"));
const OrderProductListAdmin_1 = __importDefault(require("@/components/pages/user/store/order/OrderProductListAdmin/OrderProductListAdmin"));
const api = "/api/admin/ext/ecommerce/order";
const EcommerceOrders = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [order, setOrder] = (0, react_1.useState)(null);
    const [shippingAddress, setShippingAddress] = (0, react_1.useState)({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
    });
    const [isEditingShipping, setIsEditingShipping] = (0, react_1.useState)(false);
    const [shipments, setShipments] = (0, react_1.useState)([]);
    const [selectedShipment, setSelectedShipment] = (0, react_1.useState)(null);
    const [orderStatus, setOrderStatus] = (0, react_1.useState)("");
    const handleShipmentAssignment = async () => {
        if (!selectedShipment) {
            sonner_1.toast.error("Please select a shipment");
            return;
        }
        const { data, error } = await (0, api_1.default)({
            url: `${api}/${id}/shipment`,
            method: "PUT",
            body: {
                shipmentId: selectedShipment,
            },
            silent: true,
        });
        if (!error) {
            fetchOrder();
        }
    };
    const fetchOrder = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `${api}/${id}`,
            silent: true,
        });
        if (!error) {
            setShipments(data.shipments);
            if (!data.order)
                return;
            setOrder(data.order);
            if (data.order.shippingAddress)
                setShippingAddress(data.order.shippingAddress);
            setOrderStatus(data.order.status); // Set initial order status
        }
    };
    const debounceFetchOrder = (0, lodash_1.debounce)(fetchOrder, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            debounceFetchOrder();
        }
    }, [router.isReady]);
    const handleShippingUpdate = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `${api}/${id}/shipping`,
            method: "PUT",
            body: {
                shippingAddress,
            },
            silent: true,
        });
        if (!error) {
            fetchOrder();
            setIsEditingShipping(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        const { data, error } = await (0, api_1.default)({
            url: `${api}/${id}`,
            method: "PUT",
            body: {
                status: newStatus,
            },
            silent: true,
        });
        if (!error) {
            setOrderStatus(newStatus);
            setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
    };
    return (<Default_1.default title={`${t("Order")} ${id || "Loading"}`} color="muted">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold dark:text-white">
          {t("Order")} {id} {t("Details")}
        </h1>
        <BackButton_1.BackButton href="/admin/ext/ecommerce/order"/>
      </div>
      {order ? (<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-8 flex flex-col gap-4">
            <Card_1.default className="p-4">
              <OrderUserInfo_1.default order={order}/>
              {order.products[0].type === "PHYSICAL" && (<div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2 dark:text-white">
                    {t("Shipping Address")}
                  </h2>
                  {!isEditingShipping ? (<div>
                      <OrderShippingAddressDetails_1.OrderShippingAddressDetails shippingAddress={shippingAddress}/>
                      {order.status === "PENDING" && (<Button_1.default color="primary" onClick={() => setIsEditingShipping(true)} className="mt-4">
                          {t("Edit Shipping Address")}
                        </Button_1.default>)}
                    </div>) : (<>
                      <OrderShippingAddressInputs_1.OrderShippingAddressInputs shippingAddress={shippingAddress} handleInputChange={handleInputChange}/>
                      <div className="flex justify-end col-span-2">
                        <Button_1.default color="primary" onClick={handleShippingUpdate} className="mt-4">
                          {t("Update Shipping Address")}
                        </Button_1.default>
                        <Button_1.default color="muted" onClick={() => setIsEditingShipping(false)} className="mt-4 ml-2">
                          {t("Cancel")}
                        </Button_1.default>
                      </div>
                    </>)}
                </div>)}
            </Card_1.default>

            {order.status === "PENDING" && (<div>
                <Card_1.default className="p-4">
                  {order.products[0].type === "PHYSICAL" ? (order.shipping ? (<>
                        <h2 className="text-lg font-semibold mb-2 dark:text-white">
                          {t("Shipment Details")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <OrderShippingDetails_1.OrderShippingDetails shipping={order.shipping}/>
                        </div>
                      </>) : (<>
                        <h2 className="text-lg font-semibold mb-5 dark:text-white">
                          {t("Assign Shipment")}
                        </h2>
                        <Select_1.default value={selectedShipment || ""} onChange={(e) => setSelectedShipment(e.target.value)} options={[
                        {
                            value: "",
                            label: (0, lodash_1.capitalize)(t("Select Shipment")),
                        },
                        ...shipments.map((shipment) => ({
                            value: shipment.id,
                            label: `${shipment.loadId} - ${shipment.shipper}`,
                        })),
                    ]}/>
                        <div className="flex justify-end">
                          <Button_1.default color="primary" onClick={handleShipmentAssignment} className="mt-4">
                            {t("Assign Shipment")}
                          </Button_1.default>
                        </div>
                      </>)) : (<OrderDownloadOptions_1.default order={order} orderItem={(_a = order.products[0]) === null || _a === void 0 ? void 0 : _a.ecommerceOrderItem} fetchOrder={fetchOrder}/>)}
                </Card_1.default>
              </div>)}
          </div>
          <div className="col-span-1 md:col-span-4">
            <OrderProductListAdmin_1.default products={order.products}/>
            {orderStatus === "PENDING" && (<Card_1.default className="mt-4 p-4">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                  {t("Edit Order Status")}
                </h2>
                <Select_1.default value={orderStatus} onChange={handleStatusChange} options={[
                    { value: "COMPLETED", label: t("COMPLETED") },
                    { value: "CANCELLED", label: t("CANCELLED") },
                    { value: "REJECTED", label: t("REJECTED") },
                ]}/>
              </Card_1.default>)}
          </div>
        </div>) : (<p className="dark:text-gray-300">{t("Loading order details...")}</p>)}
    </Default_1.default>);
};
exports.default = EcommerceOrders;
exports.permission = "Access Ecommerce Order Management";
