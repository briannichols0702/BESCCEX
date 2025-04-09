"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoginWallet = void 0;
const wagmi_1 = require("wagmi");
const react_1 = require("react");
const siwe_1 = require("@/utils/siwe");
const sonner_1 = require("sonner");
const useLoginWallet = () => {
    const { address, isConnected } = (0, wagmi_1.useAccount)();
    const { disconnect } = (0, wagmi_1.useDisconnect)();
    const { signMessageAsync } = (0, wagmi_1.useSignMessage)(); // Use signMessageAsync to handle promises correctly
    const { connect, error } = (0, wagmi_1.useConnect)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [signature, setSignature] = (0, react_1.useState)(null);
    const [message, setMessage] = (0, react_1.useState)(null); // State to store the message
    const handleWalletLogin = async (address, chainId) => {
        setLoading(true);
        try {
            if (!(siwe_1.siweConfig === null || siwe_1.siweConfig === void 0 ? void 0 : siwe_1.siweConfig.getMessageParams) ||
                !siwe_1.siweConfig.getNonce ||
                !siwe_1.siweConfig.createMessage) {
                throw new Error("SIWE configuration methods are not properly defined");
            }
            const messageParams = await siwe_1.siweConfig.getMessageParams();
            const nonce = await siwe_1.siweConfig.getNonce();
            const message = siwe_1.siweConfig.createMessage({
                ...messageParams,
                address,
                nonce,
                chainId,
                version: "1",
            });
            // Call signMessageAsync directly to get the signature
            const signature = await signMessageAsync({ message });
            if (!signature) {
                throw new Error("Failed to sign message");
            }
            setSignature(signature);
            setMessage(message);
        }
        catch (error) {
            console.error(error);
            sonner_1.toast.error("Signing process was cancelled or failed.");
        }
        finally {
            setLoading(false);
        }
    };
    const connectWallet = async (connector) => {
        setLoading(true);
        try {
            await connect({ connector });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    const disconnectWallet = () => {
        disconnect();
        siwe_1.siweConfig.signOut();
    };
    return {
        isConnected,
        address,
        loading,
        connectWallet,
        disconnectWallet,
        error,
        handleWalletLogin,
        signature,
        message, // Export the message state
    };
};
exports.useLoginWallet = useLoginWallet;
