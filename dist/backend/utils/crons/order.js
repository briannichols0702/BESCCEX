"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPendingOrders = void 0;
const logger_1 = require("../logger");
const BinaryOrderService_1 = require("@b/api/exchange/binary/order/util/BinaryOrderService");
async function processPendingOrders() {
    try {
        BinaryOrderService_1.BinaryOrderService.processPendingOrders();
    }
    catch (error) {
        (0, logger_1.logError)("processPendingOrders", error, __filename);
        throw error;
    }
}
exports.processPendingOrders = processPendingOrders;
