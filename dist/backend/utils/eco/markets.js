"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEcoSystemMarkets = void 0;
const db_1 = require("@b/db");
async function getEcoSystemMarkets() {
    return db_1.models.ecosystemMarket.findAll({
        where: {
            status: true,
        },
    });
}
exports.getEcoSystemMarkets = getEcoSystemMarkets;
