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
const HeadCell_1 = __importDefault(require("./HeadCell"));
const MarketRow_1 = __importDefault(require("./MarketRow"));
const react_2 = require("@iconify/react");
const MarketsTable = ({ t, items, pagination, perPage, sorted, sort, isDark, handleNavigation, }) => {
    const slicedItems = items.slice((pagination.currentPage - 1) * perPage, pagination.currentPage * perPage);
    return (<div className="flex w-full flex-col overflow-x-auto lg:overflow-x-visible ltablet:overflow-x-visible">
      <table className="border border-muted-200 bg-white font-sans dark:border-muted-800 dark:bg-muted-950">
        <thead className="border-b border-fade-grey-2 dark:border-muted-800">
          <tr className="divide-x divide-muted-200 dark:divide-muted-800">
            <th className="w-[30%] p-4">
              <HeadCell_1.default label={t("Name")} sortFn={sort} sortField="symbol" sorted={sorted}/>
            </th>
            <th className="w-[20%] p-4">
              <HeadCell_1.default label={t("Price")} sortFn={sort} sortField="price" sorted={sorted}/>
            </th>
            <th className="w-[20%] p-4">
              <HeadCell_1.default label={t("Change")} sortFn={sort} sortField="change" sorted={sorted}/>
            </th>
            <th className="w-[25%] p-4">
              <HeadCell_1.default label={t("24h Volume")} sortFn={sort} sortField="baseVolume" sorted={sorted}/>
            </th>
            <th className="w-[5%] text-end"></th>
          </tr>
        </thead>

        <tbody>
          {slicedItems.map((item, i) => (<MarketRow_1.default key={item.symbol || i} item={item} isDark={isDark} handleNavigation={handleNavigation}/>))}
          {pagination.total === 0 && (<tr>
              <td colSpan={5} className="py-3 text-center">
                <div className="py-32">
                  <react_2.Icon icon="arcticons:samsung-finder" className="mx-auto h-20 w-20 text-muted-400"/>
                  <h3 className="mb-2 font-sans text-xl text-muted-700 dark:text-muted-200">
                    {t("Nothing found")}
                  </h3>
                  <p className="mx-auto max-w-[280px] font-sans text-md text-muted-400">
                    {t("Sorry, looks like we couldn't find any matching records. Try different search terms.")}
                  </p>
                </div>
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>);
};
exports.default = (0, react_1.memo)(MarketsTable);
