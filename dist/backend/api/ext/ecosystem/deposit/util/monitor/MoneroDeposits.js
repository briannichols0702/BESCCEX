"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneroDeposits = void 0;
const xmr_1 = __importDefault(require("@b/blockchains/xmr"));
class MoneroDeposits {
    constructor(options) {
        this.wallet = options.wallet;
    }
    async watchDeposits() {
        const moneroService = await xmr_1.default.getInstance();
        await moneroService.monitorMoneroDeposits(this.wallet);
    }
}
exports.MoneroDeposits = MoneroDeposits;
