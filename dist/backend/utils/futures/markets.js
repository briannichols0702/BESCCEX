"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFuturesMarkets = void 0;
const db_1 = require("@b/db");
async function getFuturesMarkets() {
    return db_1.models.futuresMarket.findAll({
        where: {
            status: true,
        },
    });
}
exports.getFuturesMarkets = getFuturesMarkets;
