"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseMarketSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseMarketSchema = {
    id: (0, schema_1.baseStringSchema)("Unique identifier for the market"),
    currency: (0, schema_1.baseStringSchema)("Primary currency of the market"),
    pair: (0, schema_1.baseStringSchema)("Currency pair traded in this market"),
    isTrending: (0, schema_1.baseBooleanSchema)("Indicator if the market is currently trending"),
    isHot: (0, schema_1.baseBooleanSchema)("Indicator if the market is currently considered 'hot'"),
    metadata: {
        type: "object",
        description: "Additional metadata about the market",
        additionalProperties: true, // This allows any shape of nested object
    },
    status: (0, schema_1.baseBooleanSchema)("Active status of the market"),
};
