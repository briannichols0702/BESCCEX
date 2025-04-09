"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pCommissionStoreSchema = exports.p2pCommissionUpdateSchema = exports.baseP2pCommissionSchema = exports.p2pCommissionSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the P2P Commission");
const tradeId = (0, schema_1.baseStringSchema)("Trade ID associated with the commission");
const amount = (0, schema_1.baseNumberSchema)("Amount of the commission");
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the P2P Commission");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the P2P Commission", true);
exports.p2pCommissionSchema = {
    id,
    tradeId,
    amount,
    createdAt,
    updatedAt,
};
exports.baseP2pCommissionSchema = {
    id,
    tradeId,
    amount,
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the P2P Commission, if any"),
};
exports.p2pCommissionUpdateSchema = {
    type: "object",
    properties: {
        amount,
    },
    required: ["amount"],
};
exports.p2pCommissionStoreSchema = {
    description: `P2P Commission created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.p2pCommissionSchema,
            },
        },
    },
};
