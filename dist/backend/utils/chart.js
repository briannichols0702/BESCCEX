"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartData = void 0;
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const logger_1 = require("@b/utils/logger");
const timeframeGrouping = {
    d: { interval: "day", unit: "hours", count: 24 },
    w: { interval: "week", unit: "days", count: 7 },
    m: { interval: "month", unit: "days", count: 30 },
    "6m": { interval: "month", unit: "months", count: 6 },
    y: { interval: "year", unit: "months", count: 12 },
};
function dateFormatForUnit(unit) {
    switch (unit) {
        case "hours":
            return "yyyy-MM-dd HH";
        case "days":
            return "yyyy-MM-dd";
        case "months":
            return "yyyy-MM";
    }
}
function dateFormatForSequelize(unit) {
    switch (unit) {
        case "hours":
            return "%Y-%m-%d %H";
        case "days":
            return "%Y-%m-%d";
        case "months":
            return "%Y-%m";
    }
}
function parseFilterParam(filterParam) {
    if (!filterParam)
        return {};
    try {
        const parsedFilter = typeof filterParam === "string" ? JSON.parse(filterParam) : {};
        return convertStringsToBooleans(parsedFilter);
    }
    catch (error) {
        (0, logger_1.logError)("parseFilterParam", error, __filename);
        return {};
    }
}
function convertStringsToBooleans(filterObject) {
    const convertedFilter = {};
    for (const key in filterObject) {
        const value = filterObject[key];
        if (value === "true") {
            convertedFilter[key] = true;
        }
        else if (value === "false") {
            convertedFilter[key] = false;
        }
        else {
            convertedFilter[key] = value;
        }
    }
    return convertedFilter;
}
function toUTC(date) {
    return new Date(date.toISOString());
}
async function getChartData({ model, timeframe = "h", filter = "", availableFilters, customStatusHandler, where, }) {
    try {
        const rawFilter = parseFilterParam(filter);
        let whereClause = customStatusHandler
            ? customStatusHandler(rawFilter)
            : rawFilter;
        const grouping = timeframeGrouping[timeframe];
        if (!grouping) {
            throw new Error(`Invalid timeframe: ${timeframe}`);
        }
        const unit = grouping.unit;
        const count = grouping.count;
        const now = toUTC(new Date());
        const startTime = timeframe === "y"
            ? (0, date_fns_1.startOfYear)(now)
            : grouping.interval === "day"
                ? (0, date_fns_1.startOfDay)(now)
                : grouping.interval === "week"
                    ? (0, date_fns_1.startOfWeek)(now)
                    : (0, date_fns_1.startOfMonth)(now);
        const endTime = (0, date_fns_1.add)(startTime, { [unit]: count });
        const lastStartTime = (0, date_fns_1.sub)(startTime, { [unit]: count });
        const lastEndTime = (0, date_fns_1.sub)(endTime, { [unit]: count });
        if (where)
            whereClause = { ...whereClause, ...where };
        const data = await model.findAll({
            where: {
                ...whereClause,
                createdAt: { [sequelize_1.Op.between]: [startTime, endTime] },
            },
            attributes: [
                [
                    sequelize_1.Sequelize.fn("DATE_FORMAT", sequelize_1.Sequelize.col("createdAt"), dateFormatForSequelize(unit)),
                    "time",
                ],
                [sequelize_1.Sequelize.fn("COUNT", "*"), "count"],
            ],
            group: ["time"],
        });
        const groupedData = data.reduce((acc, item) => {
            const time = item.get("time") || "";
            const count = item.get("count") || 0;
            acc[time] = count;
            return acc;
        }, {});
        const organizedData = [];
        for (let date = startTime; date < endTime; date = (0, date_fns_1.add)(date, { [unit]: 1 })) {
            const dateKey = (0, date_fns_1.format)(date, dateFormatForUnit(unit));
            const count = groupedData[dateKey] || 0;
            organizedData.push({ date: dateKey, count });
        }
        const filterResults = {};
        for (const filterKey in availableFilters) {
            filterResults[filterKey] = {};
            let totalCountForFilterKey = 0;
            for (const filter of availableFilters[filterKey]) {
                const convertedValue = filter.value === "true"
                    ? true
                    : filter.value === "false"
                        ? false
                        : filter.value;
                let whereClause = customStatusHandler
                    ? customStatusHandler({ [filterKey]: convertedValue })
                    : { [filterKey]: convertedValue };
                if (where)
                    whereClause = { ...whereClause, ...where };
                const currentCount = await model.count({
                    where: {
                        ...whereClause,
                        createdAt: { [sequelize_1.Op.between]: [startTime, endTime] },
                    },
                });
                totalCountForFilterKey += currentCount;
                const previousCount = await model.count({
                    where: {
                        ...whereClause,
                        createdAt: { [sequelize_1.Op.between]: [lastStartTime, lastEndTime] },
                    },
                });
                const change = currentCount - previousCount;
                filterResults[filterKey][filter.value] = {
                    count: currentCount,
                    change,
                    percentage: 0,
                };
            }
            // Calculate percentages for each filter value under this filter key
            for (const filterValue in filterResults[filterKey]) {
                const statusData = filterResults[filterKey][filterValue];
                statusData.percentage =
                    totalCountForFilterKey > 0
                        ? (statusData.count / totalCountForFilterKey) * 100
                        : 0;
            }
        }
        return { chartData: organizedData, filterResults };
    }
    catch (error) {
        (0, logger_1.logError)("getChartData", error, __filename);
        throw error;
    }
}
exports.getChartData = getChartData;
