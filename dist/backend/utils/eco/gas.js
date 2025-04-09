"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdjustedGasPrice = exports.estimateGas = void 0;
const logger_1 = require("@b/utils/logger");
async function estimateGas(transaction, provider, adjustmentFactor = 1.2) {
    try {
        // Estimate gas required for the transaction
        const gasEstimate = await provider.estimateGas(transaction);
        // Adjust the gas estimate by a factor (to add some buffer)
        const adjustedGasEstimate = (gasEstimate * BigInt(Math.round(adjustmentFactor * 10))) / BigInt(10);
        return adjustedGasEstimate;
    }
    catch (error) {
        (0, logger_1.logError)("gas_estimation", error, __filename);
        if (error.data) {
            console.error("Revert reason:", error.data.reason);
            console.error("Revert data:", error.data);
        }
        throw new Error("Failed to estimate gas");
    }
}
exports.estimateGas = estimateGas;
async function getAdjustedGasPrice(provider, adjustmentFactor = 1.2) {
    var _a;
    try {
        // Fetch current gas price from the network
        const feeData = await provider.getFeeData();
        const currentGasPrice = (_a = feeData.gasPrice) !== null && _a !== void 0 ? _a : BigInt(0);
        // Adjust the gas price
        const adjustedGasPrice = (currentGasPrice * BigInt(Math.round(adjustmentFactor * 10))) /
            BigInt(10);
        return adjustedGasPrice;
    }
    catch (error) {
        (0, logger_1.logError)("gas_price_adjustment", error, __filename);
        throw new Error("Failed to adjust gas price");
    }
}
exports.getAdjustedGasPrice = getAdjustedGasPrice;
