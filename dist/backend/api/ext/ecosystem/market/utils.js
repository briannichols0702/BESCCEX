"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseMarketSchema = exports.getMarket = void 0;
const db_1 = require("@b/db");
async function getMarket(currency, pair) {
    const market = await db_1.models.ecosystemMarket.findOne({
        where: {
            currency,
            pair,
        },
    });
    if (!market) {
        throw new Error("Market not found");
    }
    return market;
}
exports.getMarket = getMarket;
const schema_1 = require("@b/utils/schema");
exports.baseMarketSchema = {
    id: (0, schema_1.baseNumberSchema)("Market ID"),
    name: (0, schema_1.baseStringSchema)("Market name"),
    status: (0, schema_1.baseBooleanSchema)("Market status"),
};
