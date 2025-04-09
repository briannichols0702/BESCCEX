"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TronDeposits = void 0;
const tron_1 = __importDefault(require("@b/blockchains/tron"));
class TronDeposits {
    constructor(options) {
        this.wallet = options.wallet;
        this.chain = options.chain;
        this.address = options.address;
    }
    async watchDeposits() {
        const tronService = await tron_1.default.getInstance();
        await tronService.monitorTronDeposits(this.wallet, this.address);
    }
}
exports.TronDeposits = TronDeposits;
