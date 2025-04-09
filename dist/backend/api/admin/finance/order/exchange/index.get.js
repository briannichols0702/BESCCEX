"use strict";
// /server/api/admin/exchange/orders/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "List all exchange orders",
    operationId: "listExchangeOrders",
    tags: ["Admin", "Exchange Orders"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Exchange orders retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.orderSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Exchange Orders"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Exchange Order Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.exchangeOrder,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
};
// model exchangeOrders {
//   id           String                 @id @unique @default(uuid())
//   referenceId String?                @unique
//   userId      String
//   user         user                   @relation(fields: [userId], references: [id], onDelete: Cascade, map: "exchangeOrdersUserIdForeign")
//   status       exchangeOrderStatus  @default(OPEN)
//   symbol       String                 @db.VarChar(255)
//   type         exchangeOrderType    @default(LIMIT)
//   timeInForce  exchangeTimeInForce @default(GTC)
//   side         exchangeOrderSide    @default(BUY)
//   price        Float                  @default(0)
//   average      Float?                 @default(0)
//   amount       Float                  @default(0)
//   filled       Float                  @default(0)
//   remaining    Float                  @default(0)
//   cost         Float                  @default(0)
//   trades       Json?                  @db.Json
//   fee          Float                  @default(0)
//   feeCurrency String                 @db.VarChar(255)
//   @@index([userId], map: "exchangeOrdersUserIdForeign")
// }
