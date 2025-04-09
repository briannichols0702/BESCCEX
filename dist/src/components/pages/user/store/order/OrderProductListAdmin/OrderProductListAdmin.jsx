"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ListWidgetItem_1 = __importDefault(require("@/components/widgets/ListWidgetItem"));
const MashImage_1 = require("@/components/elements/MashImage");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const next_i18next_1 = require("next-i18next");
const OrderProductListAdmin = ({ products }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Card_1.default className="p-4">
      <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
        {t("Products")}
      </h4>
      <ul className="inner-list">
        {products.map((product, index) => {
            var _a;
            return (<li key={index}>
            <ListWidgetItem_1.default href="#" avatarSize="xxs" avatar={<MashImage_1.MashImage src={product.image || "/img/placeholder.svg"} alt={product.name} width={64} height={64} className="rounded-lg"/>} title={product.name} text={`${product.price} ${product.currency}`} itemAction={<div className="flex items-center gap-2">
                  <link_1.default href={`/store/${(_a = product.category) === null || _a === void 0 ? void 0 : _a.name}/${product.name}`} className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500">
                    <react_2.Icon icon="lucide:arrow-right"/>
                  </link_1.default>
                </div>}/>
          </li>);
        })}
      </ul>
    </Card_1.default>);
};
exports.default = OrderProductListAdmin;
