"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const react_feather_1 = require("react-feather");
const NEXT_PUBLIC_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const Feature = () => {
    return (<div className="relative z-10 px-16 py-8">
      <div className="grid grid-cols-1 text-center mb-12">
        <h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold text-muted-900 dark:text-muted-100">
          Why Choose Us?
        </h3>
        <p className="text-muted-400 max-w-xl mx-auto">
          We are a huge marketplace dedicated to connecting great artists of all
          kinds with collectors and buyers. We are a platform that allows you to
          create, collect, and sell your NFTs.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
        <FeatureCard title="Create Item" description={`Create your unique NFT collection on ${NEXT_PUBLIC_SITE_NAME}: unleash your creativity now`} icon={<react_2.Icon icon="mdi:sitemap"/>}/>
        <FeatureCard title="Collect" description="Collect your favorite items now! Trade Now and Explore Collections" icon={<react_2.Icon icon="mdi:layers-outline"/>}/>
        <FeatureCard title="Sell Item" description="Sell your NFTs on our platform and earn money. We provide a secure and easy way to sell your NFTs." icon={<react_2.Icon icon="mdi:camera-plus-outline"/>}/>
      </div>
    </div>);
};
const FeatureCard = ({ title, description, icon, }) => (<div className="group relative p-12 rounded-xl bg-white dark:bg-muted-900 border border-muted-200 dark:border-muted-900 hover:shadow-lg dark:shadow-muted-700 transition-all duration-300 ease-in-out text-center overflow-hidden">
    <div className="relative overflow-hidden text-transparent -m-3 mb-6 flex justify-center">
      <react_feather_1.Hexagon className="size-28 fill-violet-600/5 rotate-[30deg] dark:fill-violet-500/5"/>
      <div className="absolute inset-0 flex justify-center items-center text-violet-600 text-5xl dark:text-violet-500">
        {icon}
      </div>
    </div>

    <div className="mt-4">
      <link_1.default href="#" className="text-lg font-semibold text-muted-800 dark:text-muted-100 hover:text-violet-600 dark:hover:text-violet-500 transition-colors duration-300">
        {title}
      </link_1.default>
      <p className="text-muted-500 dark:text-muted-400 mt-2">{description}</p>
    </div>
  </div>);
exports.default = Feature;
