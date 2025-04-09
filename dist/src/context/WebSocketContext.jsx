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
exports.AppWebSocketProvider = exports.useWebSocket = void 0;
const react_1 = __importStar(require("react"));
const dashboard_1 = require("@/stores/dashboard");
const ws_1 = __importDefault(require("@/utils/ws"));
// Context
const WebSocketContext = (0, react_1.createContext)(undefined);
const AppWebSocketProvider = ({ children, }) => {
    const { store, update, delete: deleteRecord, profile } = (0, dashboard_1.useDashboardStore)();
    const wsManager = (0, react_1.useRef)(null);
    const send = (0, react_1.useCallback)((message) => {
        if (wsManager.current && wsManager.current.isConnected()) {
            wsManager.current.send(message);
        }
        else {
            console.error("WebSocket is not connected.");
        }
    }, []);
    (0, react_1.useEffect)(() => {
        const userPath = `/api/user`;
        if (!(profile === null || profile === void 0 ? void 0 : profile.id))
            return;
        const setupWebSocket = () => {
            wsManager.current = new ws_1.default(`${userPath}?userId=${profile.id}`);
            wsManager.current.on("open", () => {
                console.log("WebSocket Connected to", userPath);
                send({ type: "SUBSCRIBE", payload: { type: "auth" } });
            });
            wsManager.current.on("close", () => {
                console.log("WebSocket Disconnected from", userPath);
                wsManager.current = null;
            });
            wsManager.current.on("error", (error) => {
                console.error("WebSocket error on", userPath, ":", error);
            });
            wsManager.current.on("message", (message) => {
                const handleStore = (stateKey, data) => {
                    store(stateKey, data);
                };
                const handleUpdate = (stateKey, { id, ids, data }) => {
                    update(stateKey, id || ids, data);
                };
                const handleDelete = (stateKey, { id, ids }) => {
                    deleteRecord(stateKey, id || ids);
                };
                switch (message.method) {
                    case "get":
                    case "create":
                        handleStore(message.type, message.payload);
                        break;
                    case "update":
                        handleUpdate(message.type, message.payload);
                        break;
                    case "delete":
                        handleDelete(message.type, message.payload);
                        break;
                    default:
                        console.log("Received unknown method", message);
                }
            });
            wsManager.current.connect();
        };
        if (profile === null || profile === void 0 ? void 0 : profile.id) {
            if (wsManager.current) {
                wsManager.current.disconnect();
                wsManager.current = null;
            }
            setupWebSocket();
        }
        else {
            if (wsManager.current) {
                wsManager.current.disconnect();
                wsManager.current = null;
            }
        }
        return () => {
            if (wsManager.current) {
                wsManager.current.disconnect();
                wsManager.current = null;
            }
        };
    }, [profile === null || profile === void 0 ? void 0 : profile.id, send, store, update, deleteRecord]);
    return (<WebSocketContext.Provider value={{ send, profile }}>
      {children}
    </WebSocketContext.Provider>);
};
exports.AppWebSocketProvider = AppWebSocketProvider;
const useWebSocket = () => {
    const context = (0, react_1.useContext)(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within an AppWebSocketProvider");
    }
    return context;
};
exports.useWebSocket = useWebSocket;
