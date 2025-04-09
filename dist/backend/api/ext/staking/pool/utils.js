"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseStakingPoolSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseStakingPoolSchema = {
    id: (0, schema_1.baseStringSchema)("Staking pool ID"),
    name: (0, schema_1.baseStringSchema)("Pool name"),
    status: (0, schema_1.baseStringSchema)("Status of the pool"),
    durations: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: (0, schema_1.baseStringSchema)("Duration ID"),
                duration: (0, schema_1.baseNumberSchema)("Duration in days"),
                interestRate: (0, schema_1.baseNumberSchema)("Interest rate"),
            },
        },
        description: "Staking durations associated with the pool",
    },
};
