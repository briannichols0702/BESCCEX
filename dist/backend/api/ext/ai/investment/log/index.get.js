"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Retrieves all investments for the logged-in user",
    description: "Fetches all AI trading investments for the currently authenticated user, excluding active investments.",
    operationId: "getAllInvestments",
    tags: ["AI Trading"],
    responses: {
        200: {
            description: "Investments retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseInvestmentSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("AI Investment"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
// [
//   {
//       "id": "2a87f8fa-7bd2-40b6-9c1c-879b8deeb93d",
//       "userId": "eba3d5c8-057c-4665-a94f-7910a97350a3",
//       "planId": "0489ccc8-2dbc-4b80-9253-6e03e7979713",
//       "durationId": "70992741-618a-4baa-bf05-f908833992fe",
//       "symbol": "MASH/BNB",
//       "type": "ECO",
//       "amount": 0.001,
//       "profit": null,
//       "result": null,
//       "status": "ACTIVE",
//       "createdAt": "2024-05-20T21:19:20.000Z",
//       "updatedAt": "2024-05-20T21:19:20.000Z",
//       "deletedAt": null,
//       "plan": {
//           "id": "0489ccc8-2dbc-4b80-9253-6e03e7979713",
//           "name": "dawdwa",
//           "title": "daw",
//           "description": "Loram Maintenance of Way, Inc. is a railroad maintenance equipment and services provider. Loram provides track maintenance services to freight, passenger, and transit railroads worldwide, as well as sells and leases equipment which performs these",
//           "image": "/uploads/aiInvestmentPlans/image/1715524821879-699058566.webp",
//           "status": true,
//           "invested": 111,
//           "profitPercentage": 1,
//           "minProfit": 0.0001,
//           "maxProfit": 11,
//           "minAmount": 0.0001,
//           "maxAmount": 11,
//           "trending": false,
//           "defaultProfit": 1,
//           "defaultResult": "WIN",
//           "createdAt": "2024-05-12T14:40:22.000Z",
//           "updatedAt": "2024-05-12T14:40:22.000Z",
//           "deletedAt": null
//       },
//       "duration": {
//           "id": "70992741-618a-4baa-bf05-f908833992fe",
//           "duration": 1,
//           "timeframe": "DAY"
//       }
//   }
// ]
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const investments = await db_1.models.aiInvestment.findAll({
        where: {
            userId: user.id,
        },
        include: [
            {
                model: db_1.models.aiInvestmentPlan,
                as: "plan",
                attributes: ["title"],
            },
            {
                model: db_1.models.aiInvestmentDuration,
                as: "duration",
                attributes: ["duration", "timeframe"],
            },
        ],
        attributes: [
            "id",
            "symbol",
            "type",
            "amount",
            "profit",
            "result",
            "status",
            "createdAt",
        ],
        order: [
            ["status", "ASC"],
            ["createdAt", "ASC"],
        ],
    });
    return investments;
};
