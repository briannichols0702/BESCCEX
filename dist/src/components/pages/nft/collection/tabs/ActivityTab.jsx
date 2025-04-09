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
const react_1 = __importStar(require("react"));
const api_1 = __importDefault(require("@/utils/api"));
const PaginationControls_1 = __importDefault(require("../elements/PaginationControls"));
const Filters_1 = __importDefault(require("./activity/Filters"));
const Table_1 = __importDefault(require("./activity/Table"));
const ActivityTab = ({ id, type, }) => {
    const [activities, setActivities] = (0, react_1.useState)([]);
    const [search, setSearch] = (0, react_1.useState)("");
    const [activityType, setActivityType] = (0, react_1.useState)("All");
    const [minValue, setMinValue] = (0, react_1.useState)(undefined);
    const [maxValue, setMaxValue] = (0, react_1.useState)(undefined);
    const [fromDate, setFromDate] = (0, react_1.useState)("");
    const [toDate, setToDate] = (0, react_1.useState)("");
    const [sortState, setSortState] = (0, react_1.useState)({
        field: "createdAt",
        rule: "desc",
    });
    const [pagination, setPagination] = (0, react_1.useState)({
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
    });
    // Function to remove undefined or empty string parameters
    const removeUndefinedParams = (params) => {
        return Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== "")
            .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    };
    // Fetch activities with the updated filter and sorting parameters
    const fetchActivities = async () => {
        if (id) {
            const queryParams = removeUndefinedParams({
                search,
                type: activityType !== "All" ? activityType.toLowerCase() : undefined,
                minValue: minValue || undefined,
                maxValue: maxValue || undefined,
                from: fromDate || undefined,
                to: toDate || undefined,
                sortBy: sortState.field,
                order: sortState.rule,
                limit: pagination.perPage,
                offset: (pagination.currentPage - 1) * pagination.perPage,
            });
            const { data, error } = await (0, api_1.default)({
                url: `/api/ext/nft/${type}/${id}/activity`,
                params: queryParams,
                silent: true,
            });
            if (data) {
                setActivities(data.activities || []);
                setPagination((prev) => ({
                    ...prev,
                    totalItems: data.activities.length,
                }));
            }
        }
    };
    // Reset pagination and fetch activities whenever filters change
    (0, react_1.useEffect)(() => {
        if (id) {
            setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1
            fetchActivities();
        }
    }, [
        id,
        search,
        activityType,
        minValue,
        maxValue,
        fromDate,
        toDate,
        sortState,
    ]);
    // Fetch activities whenever pagination changes
    (0, react_1.useEffect)(() => {
        if (id) {
            fetchActivities();
        }
    }, [pagination.currentPage, pagination.perPage]);
    return (<div className="w-full py-4">
      {/* Filters Section */}
      {type === "collection" && (<Filters_1.default search={search} setSearch={setSearch} activityType={activityType} setActivityType={setActivityType} minValue={minValue} setMinValue={setMinValue} maxValue={maxValue} setMaxValue={setMaxValue} fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} onFilter={() => {
                setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
                fetchActivities();
            }}/>)}

      {/* Activity Table */}
      <Table_1.default type={type} activities={activities} sortState={sortState} setSortState={setSortState}/>

      {/* Pagination Controls */}
      <PaginationControls_1.default pagination={pagination} setPagination={setPagination}/>
    </div>);
};
exports.default = ActivityTab;
