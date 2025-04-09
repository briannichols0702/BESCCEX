"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const nft_1 = require("@/stores/nft");
const chart_colors_1 = require("@/components/charts/chart-colors"); // Import theme colors for chart styling
const dashboard_1 = require("@/stores/dashboard");
// Use dynamic import for react-apexcharts
const Chart = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("react-apexcharts"))), { ssr: false });
const AnalyticsTab = () => {
    const { collection } = (0, nft_1.useNftStore)();
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    if (!collection)
        return null;
    const { analytics, nftAssets } = collection;
    if (!analytics)
        return null;
    // Ensure data safety and handle undefined values gracefully
    const volumePerDayData = analytics.volumePerDay || [];
    const tradesPerDayData = analytics.tradesPerDay || [];
    const averageSalePricePerDayData = analytics.averageSalePricePerDay || [];
    const ownerDistributionData = analytics.ownerDistribution || {};
    // Prepare data for each chart
    const volumeSeries = [
        {
            name: "Volume",
            data: volumePerDayData.map((item) => { var _a; return (_a = item.volume) !== null && _a !== void 0 ? _a : 0; }),
        },
    ];
    const tradesSeries = [
        {
            name: "Trades",
            data: tradesPerDayData.map((item) => { var _a; return (_a = item.trades) !== null && _a !== void 0 ? _a : 0; }),
        },
    ];
    const averagePriceSeries = [
        {
            name: "Average Sale Price",
            data: averageSalePricePerDayData.map((item) => { var _a; return (_a = item.averagePrice) !== null && _a !== void 0 ? _a : 0; }),
        },
    ];
    // Create a map of owner IDs to their names based on `nftAssets`
    const ownerNameMap = {};
    nftAssets.forEach((asset) => {
        if (asset.owner && asset.owner.id) {
            const ownerIdSegment = asset.owner.id.substring(0, 4);
            ownerNameMap[asset.owner.id] = `${asset.owner.firstName} ${asset.owner.lastName} (${ownerIdSegment})`;
        }
    });
    // Convert ownerDistribution object to ApexCharts-compatible format with full owner names
    const ownerDistributionSeries = Object.values(ownerDistributionData);
    const ownerDistributionLabels = Object.keys(ownerDistributionData).map((ownerId) => ownerNameMap[ownerId] || ownerId // Use the mapped name or fall back to ID
    );
    // Define chart options with consistent theme and styling
    const chartOptions = (title, categories, color) => ({
        chart: {
            height: 300,
            type: "line",
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        title: {
            text: title,
            align: "left",
            style: {
                color: isDark ? "#cfcfd3" : "#3f3f46",
            },
        },
        colors: [color],
        xaxis: {
            categories,
            labels: {
                rotate: -45,
                style: {
                    colors: isDark ? "#cfcfd3" : "#3f3f46",
                },
            },
        },
        yaxis: {
            labels: {
                formatter: (val) => (val !== null ? `${val.toFixed(2)}` : ""),
                style: {
                    colors: isDark ? "#cfcfd3" : "#3f3f46",
                },
            },
        },
        tooltip: { enabled: true },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.3,
                opacityFrom: 0.7,
                opacityTo: 0.3,
            },
        },
        grid: {
            row: {
                colors: ["transparent", "transparent"],
                opacity: 0.5,
            },
        },
        dataLabels: { enabled: false },
    });
    // Owner distribution options
    const ownerDistributionOptions = {
        labels: ownerDistributionLabels,
        colors: [
            chart_colors_1.themeColors.blue,
            chart_colors_1.themeColors.green,
            chart_colors_1.themeColors.orange,
            chart_colors_1.themeColors.danger,
        ],
        title: {
            text: "Owner Distribution",
            style: {
                color: isDark ? "#cfcfd3" : "#3f3f46", // Match title color with theme
            },
        },
        legend: { show: false },
        plotOptions: {
            pie: {
                expandOnClick: true,
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} NFTs`,
            },
        },
    };
    return (<div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Volume Per Day Chart */}
        <div className="bg-white dark:bg-muted-900 shadow-md rounded-lg p-4">
          <Chart options={chartOptions("Volume Per Day", volumePerDayData.map((item) => { var _a; return (_a = item.date) !== null && _a !== void 0 ? _a : ""; }), chart_colors_1.themeColors.blue // Apply blue color for Volume chart
        )} series={volumeSeries} type="area" height={300}/>
        </div>

        {/* Trades Per Day Chart */}
        <div className="bg-white dark:bg-muted-900 shadow-md rounded-lg p-4">
          <Chart options={chartOptions("Trades Per Day", tradesPerDayData.map((item) => { var _a; return (_a = item.date) !== null && _a !== void 0 ? _a : ""; }), chart_colors_1.themeColors.green // Apply green color for Trades chart
        )} series={tradesSeries} type="bar" height={300}/>
        </div>

        {/* Average Sale Price Per Day Chart */}
        <div className="bg-white dark:bg-muted-900 shadow-md rounded-lg p-4">
          <Chart options={chartOptions("Average Sale Price Per Day", averageSalePricePerDayData.map((item) => { var _a; return (_a = item.date) !== null && _a !== void 0 ? _a : ""; }), chart_colors_1.themeColors.orange // Apply orange color for Average Sale Price chart
        )} series={averagePriceSeries} type="area" height={300}/>
        </div>

        {/* Owner Distribution Donut Chart */}
        <div className="bg-white dark:bg-muted-900 shadow-md rounded-lg p-4">
          <Chart options={ownerDistributionOptions} series={ownerDistributionSeries} type="donut" height={300}/>
        </div>
      </div>
    </div>);
};
exports.default = AnalyticsTab;
