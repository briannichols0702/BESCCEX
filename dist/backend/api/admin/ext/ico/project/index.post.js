"use strict";
// /api/admin/ico/projects/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new ICO Project",
    operationId: "storeIcoProject",
    tags: ["Admin", "ICO Projects"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.icoProjectUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.icoProjectStoreSchema, "ICO Project"),
    requiresAuth: true,
    permission: "Access ICO Project Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, description, website, whitepaper, image, status } = body;
    return await (0, query_1.storeRecord)({
        model: "icoProject",
        data: {
            name,
            description,
            website,
            whitepaper,
            image,
            status,
        },
    });
};
