"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../../utils");
exports.metadata = {
    summary: "Retrieves a specific ICO token",
    description: "Fetches details of a specific ICO token by ID, including phase and contribution details.",
    operationId: "getIcoToken",
    tags: ["ICO", "Tokens"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Project ID" },
        },
    ],
    responses: {
        200: {
            description: "ICO token retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseIcoTokenSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ico Token"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    var _a, _b;
    const { params } = data;
    const { id } = params;
    const token = (await db_1.models.icoToken.findByPk(id, {
        include: [
            {
                model: db_1.models.icoPhase,
                as: "icoPhases",
                attributes: [
                    "id",
                    "name",
                    "startDate",
                    "endDate",
                    "price",
                    "status",
                    "minPurchase",
                    "maxPurchase",
                ],
                include: [
                    {
                        model: db_1.models.icoContribution,
                        as: "icoContributions",
                        attributes: ["id", "amount"],
                    },
                ],
            },
            {
                model: db_1.models.icoAllocation,
                as: "icoAllocation",
                attributes: ["id", "name", "percentage"],
            },
            {
                model: db_1.models.icoProject,
                as: "project",
                attributes: ["id", "name", "description", "website", "whitepaper"],
            },
        ],
    }));
    if (!token) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Token not found",
        });
    }
    const { icoPhases, icoAllocation, project, ...restOfData } = token.get({
        plain: true,
    });
    const phases = icoPhases === null || icoPhases === void 0 ? void 0 : icoPhases.map((phase) => {
        var _a, _b, _c, _d, _e;
        const totalContributions = (_b = (_a = phase.icoContributions) === null || _a === void 0 ? void 0 : _a.reduce((sum, contribution) => { var _a; return sum + ((_a = contribution.amount) !== null && _a !== void 0 ? _a : 0); }, 0)) !== null && _b !== void 0 ? _b : 0;
        const totalSupply = (_c = token.totalSupply) !== null && _c !== void 0 ? _c : 0; // Ensure totalSupply is defined
        const percentage = totalSupply > 0 ? (totalContributions / totalSupply) * 100 : 0;
        return {
            id: phase.id,
            name: phase.name,
            startDate: phase.startDate,
            endDate: phase.endDate,
            price: phase.price,
            status: phase.status,
            minPurchase: phase.minPurchase,
            maxPurchase: phase.maxPurchase,
            contributionPercentage: parseFloat(percentage.toFixed(8)),
            contributions: (_e = (_d = phase.icoContributions) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0,
        };
    });
    const saleAmount = (((_a = icoAllocation === null || icoAllocation === void 0 ? void 0 : icoAllocation.percentage) !== null && _a !== void 0 ? _a : 0) / 100) * ((_b = token.totalSupply) !== null && _b !== void 0 ? _b : 0);
    return { phases, icoAllocation, project, saleAmount, ...restOfData };
};
