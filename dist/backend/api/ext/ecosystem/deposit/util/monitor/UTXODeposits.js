"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTXODeposits = void 0;
const utxo_1 = require("@b/utils/eco/utxo");
const deposit_1 = require("@b/utils/eco/redis/deposit");
class UTXODeposits {
    constructor(options) {
        this.wallet = options.wallet;
        this.chain = options.chain;
        this.address = options.address;
    }
    async watchDeposits() {
        (0, utxo_1.watchAddressBlockCypher)(this.chain, this.address, async (transaction) => {
            try {
                const txDetails = await (0, utxo_1.createTransactionDetailsForUTXO)(this.wallet.id, transaction, this.address, this.chain);
                await (0, deposit_1.storeAndBroadcastTransaction)(txDetails, transaction.hash);
                transaction.outputs.forEach((output, index) => {
                    var _a;
                    if ((_a = output.addresses) === null || _a === void 0 ? void 0 : _a.includes(this.address)) {
                        (0, utxo_1.recordUTXO)(this.wallet.id, transaction.hash, index, output.value, output.script, false);
                    }
                });
            }
            catch (error) {
                console.error(`Error in UTXO deposit handler: ${error.message}`);
            }
        });
    }
}
exports.UTXODeposits = UTXODeposits;
