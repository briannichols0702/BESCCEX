"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("@b/api/admin/finance/wallet/utils");
const error_1 = require("@b/utils/error");
const matchingEngine_1 = require("@b/utils/eco/matchingEngine");
exports.metadata = {
    summary: "Lists all wallets with optional filters",
    operationId: "listWallets",
    tags: ["Finance", "Wallets"],
    parameters: [
        ...constants_1.crudParameters,
        {
            name: "pnl",
            in: "query",
            description: "Fetch PnL data for the last 28 days",
            schema: {
                type: "boolean",
            },
        },
    ],
    responses: {
        200: {
            description: "List of wallets with pagination metadata",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.walletSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Wallets"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { query, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { walletType, sortOrder, ...rest } = query;
    const { pnl } = query;
    if (pnl)
        return handlePnl(user);
    const where = { userId: user.id };
    if (walletType)
        where["type"] = walletType;
    const { items, pagination } = (await (0, query_1.getFiltered)({
        model: db_1.models.wallet,
        query: {
            ...rest,
            sortOrder: sortOrder || "asc",
        },
        where,
        sortField: rest.sortField || "currency",
        numericFields: ["balance", "inOrder"],
        paranoid: false,
    }));
    // Extract currencies of ECO type wallets
    const ecoWallets = items.filter((wallet) => wallet.type === "ECO");
    const ecoCurrencies = Array.from(new Set(ecoWallets.map((wallet) => wallet.currency)));
    if (ecoCurrencies.length > 0) {
        const ecosystemTokens = await db_1.models.ecosystemToken.findAll({
            where: { currency: ecoCurrencies },
        });
        const tokenMap = new Map(ecosystemTokens.map((token) => [token.currency, token.icon]));
        ecoWallets.forEach((wallet) => {
            wallet.icon = tokenMap.get(wallet.currency) || null;
        });
    }
    return {
        items,
        pagination,
    };
};
const handlePnl = async (user) => {
    const wallets = await db_1.models.wallet.findAll({
        where: { userId: user.id },
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [currencyPrices, exchangePrices] = await Promise.all([
        db_1.models.currency.findAll({
            where: { id: Array.from(new Set(wallets.map((w) => w.currency))) },
        }),
        db_1.models.exchangeCurrency.findAll({
            where: { currency: Array.from(new Set(wallets.map((w) => w.currency))) },
        }),
    ]);
    const currencyMap = new Map(currencyPrices.map((item) => [item.id, item.price]));
    const exchangeMap = new Map(exchangePrices.map((item) => [item.currency, item.price]));
    const engine = await matchingEngine_1.MatchingEngine.getInstance();
    const tickers = await engine.getTickers();
    // Modified to include all asset types
    const balances = { FIAT: 0, SPOT: 0, ECO: 0 };
    wallets.forEach((wallet) => {
        var _a;
        let price;
        if (wallet.type === "FIAT") {
            price = currencyMap.get(wallet.currency) || 1; // Assume 1:1 for fiat currencies
        }
        else if (wallet.type === "SPOT" || wallet.type === "ECO") {
            price =
                exchangeMap.get(wallet.currency) || ((_a = tickers[wallet.currency]) === null || _a === void 0 ? void 0 : _a.last) || 0;
        }
        if (price) {
            balances[wallet.type] += price * wallet.balance;
        }
    });
    // Ensure the balances are updated today
    const todayPnl = await db_1.models.walletPnl.findOne({
        where: {
            userId: user.id,
            createdAt: {
                [sequelize_1.Op.gte]: today,
            },
        },
    });
    if (todayPnl) {
        await todayPnl.update({ balances });
    }
    else {
        await db_1.models.walletPnl.create({
            userId: user.id,
            balances,
            createdAt: today,
        });
    }
    const oneMonthAgo = (0, date_fns_1.add)(today, { days: -28 });
    const pnlRecords = await db_1.models.walletPnl.findAll({
        where: {
            userId: user.id,
            createdAt: {
                [sequelize_1.Op.between]: [oneMonthAgo, today],
            },
        },
        attributes: ["balances", "createdAt"],
        order: [["createdAt", "ASC"]],
    });
    const dailyPnl = pnlRecords.reduce((acc, record) => {
        const dateKey = (0, date_fns_1.format)(record.createdAt, "yyyy-MM-dd");
        if (!acc[dateKey]) {
            acc[dateKey] = { FIAT: 0, SPOT: 0, FUNDING: 0 };
        }
        acc[dateKey].FIAT += record.balances.FIAT || 0;
        acc[dateKey].SPOT += record.balances.SPOT || 0;
        acc[dateKey].FUNDING += record.balances.ECO || 0;
        return acc;
    }, {});
    const pnlChart = [];
    const startOfWeek = (0, date_fns_1.add)(oneMonthAgo, { days: -oneMonthAgo.getDay() });
    for (let weekStart = startOfWeek; weekStart < today; weekStart = (0, date_fns_1.add)(weekStart, { weeks: 1 })) {
        const weekEnd = (0, date_fns_1.add)(weekStart, { days: 6 });
        let weeklyFIAT = 0, weeklySPOT = 0, weeklyFUNDING = 0;
        for (let date = weekStart; date <= weekEnd; date = (0, date_fns_1.add)(date, { days: 1 })) {
            const dateKey = (0, date_fns_1.format)(date, "yyyy-MM-dd");
            if (dailyPnl[dateKey]) {
                weeklyFIAT += dailyPnl[dateKey].FIAT;
                weeklySPOT += dailyPnl[dateKey].SPOT;
                weeklyFUNDING += dailyPnl[dateKey].FUNDING;
            }
        }
        pnlChart.push({
            date: (0, date_fns_1.format)(weekStart, "yyyy-MM-dd"),
            FIAT: weeklyFIAT,
            SPOT: weeklySPOT,
            FUNDING: weeklyFUNDING,
        });
    }
    const yesterday = (0, date_fns_1.add)(today, { days: -1 });
    const yesterdayPnlRecord = pnlRecords.find((record) => (0, date_fns_1.format)(record.createdAt, "yyyy-MM-dd") ===
        (0, date_fns_1.format)(yesterday, "yyyy-MM-dd"));
    // Calculate PnL excluding transfers and withdrawals
    const calculatePnl = (today, yesterday) => {
        const pnl = today - yesterday;
        // You may need to fetch transfer and withdrawal data here
        const transfers = 0; // Replace with actual transfer amount
        const withdrawals = 0; // Replace with actual withdrawal amount
        return pnl - transfers - withdrawals;
    };
    const todayTotal = sumBalances(balances);
    const yesterdayTotal = yesterdayPnlRecord
        ? sumBalances(yesterdayPnlRecord.balances)
        : 0;
    return {
        today: todayTotal,
        yesterday: yesterdayTotal,
        pnl: calculatePnl(todayTotal, yesterdayTotal),
        chart: pnlChart,
    };
};
const sumBalances = (balances) => {
    return Object.values(balances).reduce((acc, balance) => acc + balance, 0);
};
