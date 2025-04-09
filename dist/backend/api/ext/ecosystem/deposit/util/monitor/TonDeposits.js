"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TonDeposits = void 0;
const ton_1 = __importDefault(require("@b/blockchains/ton"));
class TonDeposits {
    constructor(options) {
        this.wallet = options.wallet;
        this.chain = options.chain;
        this.address = options.address;
    }
    async watchDeposits() {
        const tonService = await ton_1.default.getInstance();
        await tonService.monitorTonDeposits(this.wallet, this.address);
    }
}
exports.TonDeposits = TonDeposits;
