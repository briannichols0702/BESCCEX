"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siweConfig = void 0;
const api_1 = __importDefault(require("@/utils/api"));
const react_1 = require("next-auth/react");
const siwe_1 = require("@web3modal/siwe");
const chains_1 = require("wagmi/chains");
exports.siweConfig = (0, siwe_1.createSIWEConfig)({
    getMessageParams: async () => ({
        domain: typeof window !== "undefined" ? window.location.host : "",
        uri: typeof window !== "undefined" ? window.location.origin : "",
        chains: [
            chains_1.mainnet.id,
            chains_1.arbitrum.id,
            chains_1.polygon.id,
            chains_1.bsc.id,
            chains_1.fantom.id,
            chains_1.avalanche.id,
        ],
        statement: "Please sign with your account",
        issuedAt: Math.floor(Date.now() / 1000),
    }),
    createMessage: ({ address, ...args }) => (0, siwe_1.formatMessage)(args, address),
    getNonce: async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/auth/login/nonce",
            silent: true,
        });
        if (error) {
            throw new Error("Failed to get nonce!");
        }
        return data;
    },
    getSession: async () => {
        const session = await (0, react_1.getSession)();
        if (!session) {
            throw new Error("Failed to get session!");
        }
        const { address, chainId } = session;
        return { address, chainId };
    },
    verifyMessage: async ({ message, signature }) => {
        try {
            const success = await (0, react_1.signIn)("credentials", {
                message,
                redirect: false,
                signature,
                callbackUrl: "/protected",
            });
            return Boolean(success === null || success === void 0 ? void 0 : success.ok);
        }
        catch (error) {
            return false;
        }
    },
    signOut: async () => {
        try {
            await (0, react_1.signOut)({
                redirect: false,
            });
            return true;
        }
        catch (error) {
            return false;
        }
    },
});
