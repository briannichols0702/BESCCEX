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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const LineChart = ({ width = 150, height = 80, values = [], }) => {
    const padding = 10; // Add padding to ensure the circle is fully visible
    const svgBox = `0 0 ${width + padding * 2} ${height + padding * 2}`;
    const [strokeColor, setStrokeColor] = (0, react_1.useState)("#6b7280");
    (0, react_1.useEffect)(() => {
        if (values.length < 2) {
            setStrokeColor("#6b7280");
            return;
        }
        const lastValue = values[values.length - 1];
        const prevValue = values[values.length - 2];
        if (lastValue > prevValue) {
            setStrokeColor("#14b8a6"); // green for increase
        }
        else if (lastValue < prevValue) {
            setStrokeColor("#f43f5e"); // red for decrease
        }
        // If there's no change, keep the current color
    }, [values]);
    const calculatePathData = () => {
        if (values.length === 0)
            return { pathData: "", cx: 0, cy: 0 };
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const range = maxValue - minValue;
        // Handle cases where all values are the same (range == 0)
        const effectiveRange = range === 0 ? 1 : range;
        const points = values.map((value, index) => {
            const x = (index / (values.length - 1)) * (width - 2 * padding) + padding;
            const y = height -
                ((value - minValue) / effectiveRange) * (height - 2 * padding) -
                padding; // Adjust y to prevent cutoff
            return { x, y };
        });
        const pathData = points.reduce((acc, point, index, arr) => {
            if (index === 0) {
                return `M ${point.x} ${point.y}`;
            }
            const prev = arr[index - 1];
            const cp1x = (prev.x + point.x) / 2;
            const cp1y = prev.y;
            const cp2x = (prev.x + point.x) / 2;
            const cp2y = point.y;
            return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
        }, "");
        const lastPoint = points[points.length - 1] || { x: 0, y: 0 };
        return {
            pathData,
            cx: lastPoint.x,
            cy: lastPoint.y,
        };
    };
    const { pathData, cx, cy } = calculatePathData();
    return (<section className={`${!values.length ? "transparent" : ""}`}>
      <svg viewBox={svgBox} xmlns="http://www.w3.org/2000/svg" width={width + padding * 2} height={height + padding * 2}>
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={cx} cy={cy} r="3" fill={strokeColor} stroke="none"/>
        <circle cx={cx} cy={cy} r="3" className="pulsing-circle" style={{ stroke: strokeColor }}/>
      </svg>
    </section>);
};
exports.default = LineChart;
