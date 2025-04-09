"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLicense = exports.standardizeOkxData = exports.countDecimals = exports.standardizeXtData = exports.standardizeKucoinData = exports.standardizeBinanceData = void 0;
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
// Function to standardize data from Binance
const standardizeBinanceData = (data) => {
    if (data && typeof data === "object" && !Array.isArray(data)) {
        return Object.values(data).map((item) => {
            const info = item.info; // Extract the info object
            return {
                network: item.network,
                withdrawStatus: item.withdraw, // Use the correct property from the top level
                depositStatus: item.deposit, // Use the correct property from the top level
                minWithdraw: parseFloat(info.withdrawMin),
                maxWithdraw: parseFloat(info.withdrawMax),
                withdrawFee: parseFloat(info.withdrawFee),
                withdrawMemo: info.memoRegex && info.memoRegex.trim() !== "" ? true : false,
            };
        });
    }
    return []; // Return an empty array if data does not match expected structure
};
exports.standardizeBinanceData = standardizeBinanceData;
// Function to standardize data from Kucoin
const standardizeKucoinData = (data) => {
    const standardizedData = Object.values(data.networks || []);
    return standardizedData.map((network) => {
        var _a, _b, _c, _d, _e;
        return ({
            network: network.name,
            withdrawStatus: network.withdraw,
            depositStatus: network.deposit,
            minWithdraw: parseFloat((_c = (_b = (_a = network.limits) === null || _a === void 0 ? void 0 : _a.withdrawal) === null || _b === void 0 ? void 0 : _b.min) !== null && _c !== void 0 ? _c : 0),
            maxWithdraw: null, // Not provided by KuCoin
            withdrawFee: parseFloat((_d = network.fee) !== null && _d !== void 0 ? _d : 0),
            withdrawMemo: network.contractAddress && network.contractAddress.trim() !== ""
                ? true
                : false,
            chainId: network.id ? network.id.toUpperCase() : null, // Ensure id exists before calling toUpperCase
            precision: countDecimals((_e = network.precision) !== null && _e !== void 0 ? _e : 0) || 8, // Ensure precision is defined
        });
    });
};
exports.standardizeKucoinData = standardizeKucoinData;
const standardizeXtData = (data) => {
    var _a, _b, _c, _d, _e, _f;
    const standardizedData = [];
    if (data && typeof data === "object") {
        for (const networkKey in data.networks || {}) {
            const network = data.networks[networkKey];
            const fee = parseFloat(data.fee);
            // Set fee to null if it's invalid
            const validFee = !isNaN(fee) ? fee : null;
            standardizedData.push({
                network: networkKey,
                withdrawStatus: data.info.withdrawStatus === "1",
                depositStatus: data.info.depositStatus === "1",
                minWithdraw: parseFloat((_c = (_b = (_a = network.limits) === null || _a === void 0 ? void 0 : _a.withdraw) === null || _b === void 0 ? void 0 : _b.min) !== null && _c !== void 0 ? _c : "0"),
                maxWithdraw: ((_e = (_d = network.limits) === null || _d === void 0 ? void 0 : _d.withdraw) === null || _e === void 0 ? void 0 : _e.max)
                    ? parseFloat(network.limits.withdraw.max)
                    : null,
                withdrawFee: validFee !== null && validFee !== void 0 ? validFee : 0,
                withdrawMemo: false, // XT data doesn't have memo information, defaulting to false
                chainId: networkKey.toUpperCase(), // Using the network key as the chain ID
                precision: countDecimals((_f = data.precision) !== null && _f !== void 0 ? _f : 1e-8),
            });
        }
    }
    return standardizedData;
};
exports.standardizeXtData = standardizeXtData;
function countDecimals(num) {
    if (Math.floor(num) === num)
        return 0;
    const str = num.toString();
    const scientificNotationMatch = /^(\d+\.?\d*|\.\d+)e([\+\-]\d+)$/.exec(str);
    if (scientificNotationMatch) {
        const decimalStr = scientificNotationMatch[1].split(".")[1] || "";
        let decimalCount = decimalStr.length + parseInt(scientificNotationMatch[2]);
        decimalCount = Math.abs(decimalCount); // Take the absolute value
        return Math.min(decimalCount, 8);
    }
    else {
        const decimalStr = str.split(".")[1] || "";
        return Math.min(decimalStr.length, 8);
    }
}
exports.countDecimals = countDecimals;
// Function to standardize data from Okex
const standardizeOkxData = (data) => {
    if (data && typeof data === "object" && !Array.isArray(data)) {
        return Object.values(data).map((item) => {
            return {
                network: item.network,
                withdrawStatus: item.withdraw,
                depositStatus: item.deposit,
                minWithdraw: parseFloat(item.minWithdrawal),
                maxWithdraw: parseFloat(item.maxWithdrawal),
                withdrawFee: parseFloat(item.withdrawalFee),
                withdrawMemo: item.memoRegex && item.memoRegex.trim() !== "" ? true : false,
            };
        });
    }
    return [];
};
exports.standardizeOkxData = standardizeOkxData;
async function saveLicense(productId, username) {
    // Start a transaction
    await db_1.sequelize
        .transaction(async (transaction) => {
        // Update exchanges to set status false where productId is not the given productId
        await db_1.models.exchange.update({
            status: false,
        }, {
            where: {
                status: true,
                productId: { [sequelize_1.Op.not]: productId },
            },
            transaction,
        });
        // Update the specific exchange by productId to set the new license status and username
        await db_1.models.exchange.update({
            licenseStatus: true,
            status: true,
            username: username,
        }, {
            where: { productId: productId },
            transaction,
        });
    })
        .catch((error) => {
        console.error("Error in saveLicense:", error);
        throw new Error(`Failed to save license: ${error.message}`);
    });
}
exports.saveLicense = saveLicense;
