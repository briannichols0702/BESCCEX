"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDeposits = void 0;
const sol_1 = __importDefault(require("@b/blockchains/sol"));
const tokens_1 = require("@b/utils/eco/tokens");
class SolanaDeposits {
    constructor(options) {
        this.active = true;
        this.wallet = options.wallet;
        this.chain = options.chain;
        this.currency = options.currency;
        this.address = options.address;
    }
    async watchDeposits() {
        const solanaService = await sol_1.default.getInstance();
        if (this.currency === "SOL") {
            await solanaService.monitorSolanaDeposits(this.wallet, this.address, () => this.stopPolling());
        }
        else {
            const token = await (0, tokens_1.getEcosystemToken)(this.chain, this.currency);
            if (!token || !token.contract) {
                console.error(`SPL Token ${this.currency} not found or invalid mint address`);
                return;
            }
            await solanaService.monitorSPLTokenDeposits(this.wallet, this.address, token.contract, () => this.stopPolling());
        }
    }
    stopPolling() {
        this.active = false;
        console.log(`Monitor for wallet ${this.wallet.id} has stopped polling.`);
    }
}
exports.SolanaDeposits = SolanaDeposits;
