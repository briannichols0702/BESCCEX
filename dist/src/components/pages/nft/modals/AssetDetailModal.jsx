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
const nft_1 = require("@/stores/nft");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Header_1 = __importDefault(require("./AssetDetail/Header"));
const Info_1 = __importDefault(require("./AssetDetail/Info"));
const Attributes_1 = __importDefault(require("./AssetDetail/Attributes"));
const Tabs_1 = __importDefault(require("./AssetDetail/Tabs"));
const PurchaseModal_1 = __importDefault(require("./PurchaseModal"));
const AssetDetailModal = ({ asset, isVisible, onClose, onPrev, onNext, }) => {
    var _a;
    const { collection, isPurchaseModalVisible, closePurchaseModal } = (0, nft_1.useNftStore)();
    // Disable body scroll when the modal is visible
    (0, react_1.useEffect)(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden"; // Disable scrolling
        }
        else {
            document.body.style.overflow = ""; // Reset scrolling
        }
        // Cleanup to reset the scroll style when component unmounts
        return () => {
            document.body.style.overflow = "";
        };
    }, [isVisible]);
    if (!isVisible || !collection)
        return null;
    return (<div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs">
      {/* Modal Container */}
      <div className="bg-white dark:bg-muted-900 w-full max-w-5xl rounded-lg overflow-hidden shadow-lg relative">
        {/* Close Button */}
        <div className="absolute top-6 right-6">
          <IconButton_1.default onClick={onClose} color="muted">
            <react_2.Icon icon="mdi:close"/>
          </IconButton_1.default>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto custom-scroll max-h-[80vh] h-[80vh]">
          <div className="flex flex-col md:flex-row overflow-hidden">
            {/* Asset Image Section */}
            <div className="md:w-1/2 flex justify-center items-center p-6">
              <img src={asset.image} alt={asset.name} className="w-full h-auto rounded-lg object-cover"/>
            </div>

            {/* Right Section - Scrollable Content */}
            <div className="md:w-1/2 space-y-6 flex flex-col justify-between p-6">
              <Header_1.default onPrev={onPrev} onNext={onNext} index={asset.index}/>
              <Info_1.default asset={asset} collection={collection}/>
            </div>
          </div>

          {/* Scrollable Additional Sections */}
          <div className="flex gap-6 px-6 pb-6">
            {/* Attributes Section */}
            <div className="hidden md:block md:w-1/3">
              <Attributes_1.default attributes={(_a = asset.attributes) === null || _a === void 0 ? void 0 : _a.attributes}/>
            </div>

            {/* Details Tabs */}
            <div className="w-full">
              <Tabs_1.default collection={collection} asset={asset}/>
            </div>
          </div>
        </div>
      </div>

      <PurchaseModal_1.default isVisible={isPurchaseModalVisible} onClose={closePurchaseModal} asset={asset} chain={collection.chain}/>
    </div>);
};
exports.default = AssetDetailModal;
