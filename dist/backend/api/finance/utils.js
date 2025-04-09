"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = void 0;
const db_1 = require("@b/db");
async function updateTransaction(id, data) {
    await db_1.models.transaction.update({
        ...data,
    }, {
        where: {
            id,
        },
    });
    const updatedTransaction = await db_1.models.transaction.findByPk(id, {
        include: [
            {
                model: db_1.models.wallet,
                as: "wallet",
                attributes: ["id", "currency"],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
    if (!updatedTransaction) {
        throw new Error("Transaction not found");
    }
    return updatedTransaction.get({ plain: true });
}
exports.updateTransaction = updateTransaction;
