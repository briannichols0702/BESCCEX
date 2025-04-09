"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Get a single exchange currency",
    operationId: "getCurrency",
    tags: ["Admin", "Exchange Currencies"],
    description: "Retrieve details of a single exchange currency by ID",
    parameters: [
        {
            in: "path",
            name: "id",
            required: true,
            schema: {
                type: "string",
            },
            description: "ID of the exchange currency",
        },
    ],
    responses: {
        200: {
            description: "Details of the exchange currency",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseExchangeCurrencySchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Exchange Currency"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Spot Currency Management"
};
exports.default = async (params) => {
    const currency = await db_1.models.exchangeCurrency.findOne({
        where: { id: parseInt(params.id) },
    });
    if (!currency) {
        throw new Error("Currency not found");
    }
    return currency.get({ plain: true });
};
// model exchangeCurrency {
//   id        String  @id @unique @default(uuid())
//   currency  String  @unique
//   name      String  @db.VarChar(255)
//   precision Float   @default(8)
//   price     Float?  @default(0)
//   status    Boolean @default(true)
//   chains    Json?   @db.Json
// }
