"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalOrders = exports.paypalClient = void 0;
const checkout_server_sdk_1 = require("@paypal/checkout-server-sdk");
Object.defineProperty(exports, "paypalOrders", { enumerable: true, get: function () { return checkout_server_sdk_1.orders; } });
function environment() {
    const clientId = process.env.NEXT_PUBLIC_APP_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.APP_PAYPAL_CLIENT_SECRET;
    if (process.env.NODE_ENV === "production") {
        return new checkout_server_sdk_1.core.LiveEnvironment(clientId, clientSecret);
    }
    else {
        return new checkout_server_sdk_1.core.SandboxEnvironment(clientId, clientSecret);
    }
}
function paypalClient() {
    return new checkout_server_sdk_1.core.PayPalHttpClient(environment());
}
exports.paypalClient = paypalClient;
