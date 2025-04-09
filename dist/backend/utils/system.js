"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.updateBlockchainQuery = exports.updateExtensionQuery = void 0;
const db_1 = require("@b/db");
async function updateExtensionQuery(id, version) {
    return await db_1.models.extension.update({
        version: version,
    }, {
        where: {
            productId: id,
        },
    });
}
exports.updateExtensionQuery = updateExtensionQuery;
async function updateBlockchainQuery(id, version) {
    return await db_1.models.ecosystemBlockchain.update({
        version: version,
    }, {
        where: {
            productId: id,
        },
    });
}
exports.updateBlockchainQuery = updateBlockchainQuery;
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
