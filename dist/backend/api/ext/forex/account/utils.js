"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseForexAccountSchema = exports.baseForexAccountUserSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseForexAccountUserSchema = {
    uuid: (0, schema_1.baseStringSchema)("User UUID"),
    firstName: (0, schema_1.baseStringSchema)("User's first name"),
    lastName: (0, schema_1.baseStringSchema)("User's last name"),
    avatar: (0, schema_1.baseStringSchema)("User's avatar URL", 255, 0, true),
};
exports.baseForexAccountSchema = {
    accountId: (0, schema_1.baseStringSchema)("The unique identifier for the Forex account"),
    broker: (0, schema_1.baseStringSchema)("Broker name"),
    status: (0, schema_1.baseBooleanSchema)("Current status of the account"),
    type: (0, schema_1.baseStringSchema)("Type of the account (DEMO or LIVE)"),
    mt: (0, schema_1.baseStringSchema)("MetaTrader version"),
    balance: (0, schema_1.baseNumberSchema)("Current balance in the account"),
    leverage: (0, schema_1.baseStringSchema)("Account leverage"),
    user: {
        type: "object",
        description: "User details associated with the account",
        properties: exports.baseForexAccountUserSchema,
    },
};
