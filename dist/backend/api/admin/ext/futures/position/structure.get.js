"use strict";
// backend/api/admin/ext/futures/position/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for futures positions",
    operationId: "getFuturesPositionStructure",
    tags: ["Admin", "Futures Position"],
    responses: {
        200: {
            description: "Form structure for futures positions",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Futures Position Management",
};
const positionStructure = () => {
    const id = {
        type: "input",
        label: "ID",
        name: "id",
        placeholder: "Enter ID",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "OPEN", label: "Open" },
            { value: "CLOSED", label: "Closed" },
            { value: "CANCELLED", label: "Cancelled" },
        ],
        placeholder: "Select status",
        ts: "string",
    };
    const symbol = {
        type: "input",
        label: "Symbol",
        name: "symbol",
        placeholder: "BTC/USD",
    };
    const side = {
        type: "select",
        label: "Side",
        name: "side",
        options: [
            { value: "BUY", label: "Buy" },
            { value: "SELL", label: "Sell" },
        ],
        placeholder: "Select Side",
        ts: "string",
    };
    const entryPrice = {
        type: "input",
        label: "Entry Price",
        name: "entryPrice",
        placeholder: "Enter entry price",
        ts: "number",
    };
    const amount = {
        type: "input",
        label: "Amount",
        name: "amount",
        placeholder: "Enter amount",
        ts: "number",
    };
    const leverage = {
        type: "input",
        label: "Leverage",
        name: "leverage",
        placeholder: "Enter leverage",
        ts: "number",
    };
    const unrealizedPnl = {
        type: "input",
        label: "Unrealized PnL",
        name: "unrealizedPnl",
        placeholder: "Enter unrealized PnL",
        ts: "number",
    };
    const stopLossPrice = {
        type: "input",
        label: "Stop Loss Price",
        name: "stopLossPrice",
        placeholder: "Enter stop loss price",
        ts: "number",
    };
    const takeProfitPrice = {
        type: "input",
        label: "Take Profit Price",
        name: "takeProfitPrice",
        placeholder: "Enter take profit price",
        ts: "number",
    };
    return {
        id,
        status,
        symbol,
        side,
        entryPrice,
        amount,
        leverage,
        unrealizedPnl,
        stopLossPrice,
        takeProfitPrice,
    };
};
exports.positionStructure = positionStructure;
exports.default = async () => {
    const { id, status, symbol, side, entryPrice, amount, leverage, unrealizedPnl, stopLossPrice, takeProfitPrice, } = (0, exports.positionStructure)();
    return {
        get: {
            positionDetails: [
                id,
                status,
                symbol,
                side,
                entryPrice,
                amount,
                leverage,
                unrealizedPnl,
                stopLossPrice,
                takeProfitPrice,
            ],
        },
        set: [
            id,
            symbol,
            [status, side],
            [entryPrice, amount],
            leverage,
            unrealizedPnl,
            [stopLossPrice, takeProfitPrice],
        ],
    };
};
