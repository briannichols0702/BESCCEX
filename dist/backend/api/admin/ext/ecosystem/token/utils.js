"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminToken = exports.updateStatusBulk = exports.getNoPermitTokens = exports.updateAdminTokenIcon = exports.importEcosystemToken = exports.createEcosystemToken = exports.getEcosystemTokensByChain = exports.getEcosystemTokenById = exports.getEcosystemTokenByChainAndCurrency = exports.getEcosystemTokensAll = exports.ecosystemTokenStoreSchema = exports.ecosystemTokenImportSchema = exports.ecosystemTokenDeploySchema = exports.ecosystemTokenUpdateSchema = exports.baseEcosystemTokenSchema = exports.ecosystemTokenSchema = exports.updateIconInCache = void 0;
const db_1 = require("@b/db");
const redis_1 = require("@b/utils/redis");
const schema_1 = require("@b/utils/schema");
const redis = redis_1.RedisSingleton.getInstance();
const CACHE_KEY_PREFIX = "ecosystem_token_icon:";
const CACHE_EXPIRY = 3600; // 1 hour in seconds
async function updateIconInCache(currency, icon) {
    const cacheKey = `${CACHE_KEY_PREFIX}${currency}`;
    await redis.set(cacheKey, icon, "EX", CACHE_EXPIRY);
}
exports.updateIconInCache = updateIconInCache;
const id = (0, schema_1.baseStringSchema)("ID of the ecosystem token");
const contract = (0, schema_1.baseStringSchema)("Contract address of the token");
const name = (0, schema_1.baseStringSchema)("Name of the token");
const currency = (0, schema_1.baseStringSchema)("Currency of the token");
const chain = (0, schema_1.baseStringSchema)("Blockchain chain associated with the token");
const network = (0, schema_1.baseStringSchema)("Network where the token operates");
const type = (0, schema_1.baseStringSchema)("Type of the token");
const decimals = (0, schema_1.baseNumberSchema)("Number of decimals for the token");
const status = (0, schema_1.baseBooleanSchema)("Operational status of the token");
const precision = (0, schema_1.baseNumberSchema)("Precision level of the token");
const limits = {
    type: "object",
    nullable: true,
    properties: {
        deposit: {
            type: "object",
            properties: {
                min: (0, schema_1.baseNumberSchema)("Minimum deposit amount"),
                max: (0, schema_1.baseNumberSchema)("Maximum deposit amount"),
            },
        },
        withdraw: {
            type: "object",
            properties: {
                min: (0, schema_1.baseNumberSchema)("Minimum withdrawal amount"),
                max: (0, schema_1.baseNumberSchema)("Maximum withdrawal amount"),
            },
        },
    },
};
const fee = {
    type: "object",
    nullable: true,
    properties: {
        min: (0, schema_1.baseNumberSchema)("Minimum fee amount"),
        percentage: (0, schema_1.baseNumberSchema)("Percentage fee amount"),
    },
};
const icon = (0, schema_1.baseStringSchema)("URL to the token icon", 1000, 0, true);
const contractType = (0, schema_1.baseEnumSchema)("Type of contract (PERMIT, NO_PERMIT, NATIVE)", ["PERMIT", "NO_PERMIT", "NATIVE"]);
exports.ecosystemTokenSchema = {
    id,
    contract,
    name,
    currency,
    chain,
    network,
    type,
    decimals,
    status,
    precision,
    limits,
    fee,
    icon,
    contractType,
};
exports.baseEcosystemTokenSchema = {
    id,
    contract,
    name,
    currency,
    chain,
    network,
    type,
    decimals,
    status,
    precision,
    limits,
    fee,
    icon,
    contractType,
};
exports.ecosystemTokenUpdateSchema = {
    type: "object",
    properties: {
        icon,
        fee,
        limits,
        status,
    },
    required: [],
};
exports.ecosystemTokenDeploySchema = {
    type: "object",
    properties: {
        name,
        currency,
        chain,
        network,
        type,
        decimals,
        status,
        precision,
        limits,
        fee,
        icon,
        initialSupply: (0, schema_1.baseNumberSchema)("Initial supply of the token"),
        initialHolder: (0, schema_1.baseStringSchema)("Address of the initial token holder"),
        marketCap: (0, schema_1.baseNumberSchema)("Maximum supply cap of the token"),
    },
    required: [
        "name",
        "currency",
        "chain",
        "network",
        "decimals",
        "initialSupply",
        "initialHolder",
        "marketCap",
    ],
};
exports.ecosystemTokenImportSchema = {
    type: "object",
    properties: {
        icon,
        name,
        currency,
        chain,
        network,
        contract,
        contractType,
        decimals,
        precision,
        type,
        fee,
        limits,
        status,
    },
    required: [
        "name",
        "currency",
        "chain",
        "network",
        "contract",
        "decimals",
        "type",
        "contractType",
    ],
};
exports.ecosystemTokenStoreSchema = {
    description: `Ecosystem token created or updated successfully`,
    content: {
        "application/json": {
            schema: exports.ecosystemTokenDeploySchema,
        },
    },
};
// Fetch all tokens without filtering
async function getEcosystemTokensAll() {
    return db_1.models.ecosystemToken.findAll();
}
exports.getEcosystemTokensAll = getEcosystemTokensAll;
// Fetch a single token by chain and currency
async function getEcosystemTokenByChainAndCurrency(chain, currency) {
    return db_1.models.ecosystemToken.findOne({
        where: {
            chain,
            currency,
        },
    });
}
exports.getEcosystemTokenByChainAndCurrency = getEcosystemTokenByChainAndCurrency;
// Fetch a single token by ID
async function getEcosystemTokenById(id) {
    return db_1.models.ecosystemToken.findByPk(id);
}
exports.getEcosystemTokenById = getEcosystemTokenById;
// Fetch tokens by chain
async function getEcosystemTokensByChain(chain) {
    return db_1.models.ecosystemToken.findAll({
        where: {
            chain,
            network: process.env[`${chain}_NETWORK`],
        },
    });
}
exports.getEcosystemTokensByChain = getEcosystemTokensByChain;
// Create a new token
async function createEcosystemToken({ chain, name, currency, contract, decimals, type, network, }) {
    return db_1.models.ecosystemToken.create({
        chain,
        name,
        currency,
        contract,
        decimals,
        type,
        network,
        status: true,
        contractType: "PERMIT",
    });
}
exports.createEcosystemToken = createEcosystemToken;
// Import a new token
async function importEcosystemToken({ name, currency, chain, network, type, contract, decimals, contractType, }) {
    return db_1.models.ecosystemToken.create({
        name,
        currency,
        chain,
        network,
        type,
        contract,
        decimals,
        status: true,
        contractType,
    });
}
exports.importEcosystemToken = importEcosystemToken;
// Update a token's icon
async function updateAdminTokenIcon(id, icon) {
    await db_1.models.ecosystemToken.update({ icon }, {
        where: { id },
    });
}
exports.updateAdminTokenIcon = updateAdminTokenIcon;
// Fetch tokens without permit
async function getNoPermitTokens(chain) {
    return db_1.models.ecosystemToken.findAll({
        where: {
            chain,
            contractType: "NO_PERMIT",
            network: process.env[`${chain}_NETWORK`],
            status: true,
        },
    });
}
exports.getNoPermitTokens = getNoPermitTokens;
// Update multiple tokens' status in bulk
async function updateStatusBulk(ids, status) {
    await db_1.models.ecosystemToken.update({ status }, {
        where: { id: ids },
    });
}
exports.updateStatusBulk = updateStatusBulk;
// Update a token with precision, limits, and fee
async function updateAdminToken(id, precision, limits, fee) {
    await db_1.models.ecosystemToken.update({
        precision,
        limits,
        fee,
    }, {
        where: { id },
    });
}
exports.updateAdminToken = updateAdminToken;
