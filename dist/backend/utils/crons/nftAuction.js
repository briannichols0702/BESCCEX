"use strict";
// scripts/processEndedAuctions.ts
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
const notifications_1 = require("../notifications");
async function processEndedAuctions() {
    const transaction = await db_1.sequelize.transaction();
    try {
        const endedAuctions = (await db_1.models.nftAuction.findAll({
            where: {
                status: "ACTIVE",
                endTime: { [sequelize_1.Op.lte]: new Date() },
            },
            include: [
                {
                    model: db_1.models.nftBid,
                    as: "nftBids",
                    where: { status: "PENDING" },
                    required: false,
                    separate: true,
                    order: [["amount", "DESC"]],
                    limit: 1,
                },
                {
                    model: db_1.models.nftAsset,
                    as: "nftAsset",
                },
            ],
        }));
        for (const auction of endedAuctions) {
            if (auction.nftBids.length > 0) {
                const highestBid = auction.nftBids[0];
                // Check if reserve price is met
                if (auction.reservePrice && highestBid.amount < auction.reservePrice) {
                    // Reserve price not met, cancel auction
                    await auction.update({ status: "CANCELLED" }, { transaction });
                    await highestBid.update({ status: "DECLINED" }, { transaction });
                }
                else {
                    // Complete the transaction
                    const nftAsset = auction.nftAsset;
                    const sellerId = nftAsset.ownerId;
                    const buyerId = highestBid.bidderId;
                    const price = highestBid.amount;
                    // Transfer ownership
                    await nftAsset.update({ ownerId: buyerId }, { transaction });
                    // Record the transaction
                    // await models.nftTransaction.create(
                    //   {
                    //     nftAssetId: nftAsset.id,
                    //     sellerId,
                    //     buyerId,
                    //     price,
                    //     transactionHash: generateTransactionHash(),
                    //     status: "COMPLETED",
                    //   },
                    //   { transaction }
                    // );
                    // Update auction and bid status
                    await auction.update({ status: "COMPLETED" }, { transaction });
                    await highestBid.update({ status: "ACCEPTED" }, { transaction });
                    // Send notifications
                    await (0, notifications_1.handleNotification)({
                        userId: sellerId,
                        title: "Auction Sold",
                        message: `Your NFT "${nftAsset.name}" has been sold via auction.`,
                        type: "ACTIVITY",
                    });
                    await (0, notifications_1.handleNotification)({
                        userId: buyerId,
                        title: "Auction Won",
                        message: `You have won the auction for "${nftAsset.name}".`,
                        type: "ACTIVITY",
                    });
                }
            }
            else {
                // No bids, cancel auction
                await auction.update({ status: "CANCELLED" }, { transaction });
            }
        }
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        console.error("Error processing ended auctions:", error);
    }
}
function generateTransactionHash() {
    return "0x" + Math.random().toString(16).substr(2, 64);
}
// Schedule this function to run periodically
processEndedAuctions();
