"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripeApiKey = process.env.APP_STRIPE_SECRET_KEY;
const useStripe = () => {
    if (!stripeApiKey) {
        throw new Error("Stripe API key is not set in environment variables.");
    }
    return new stripe_1.default(stripeApiKey);
};
exports.useStripe = useStripe;
