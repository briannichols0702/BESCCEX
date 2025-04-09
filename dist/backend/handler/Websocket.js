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
exports.handleClientMessage = exports.handleRouteClientsMessage = exports.getRouteClientCount = exports.getRouteSubscriptions = exports.getRouteClientSubscriptions = exports.getRouteClient = exports.getRouteClients = exports.hasClients = exports.getClients = exports.sendMessageToRouteClients = exports.sendMessageToRoute = exports.sendMessageToClient = exports.removeSubscription = exports.removeClient = exports.addClient = exports.handleWsMethod = void 0;
const ws_1 = require("@b/utils/ws");
const Middleware_1 = require("./Middleware");
const Request_1 = require("./Request");
const Response_1 = require("./Response");
const passwords_1 = require("@b/utils/passwords");
const query_1 = require("@b/utils/query");
const logger_1 = require("@b/utils/logger");
const Routes_1 = require("./Routes");
const clients = new Map();
async function handleWsMethod(app, routePath, entryPath) {
    let handler, metadata, onClose;
    const cached = Routes_1.routeCache.get(entryPath);
    if (cached && cached.handler && cached.metadata) {
        handler = cached.handler;
        metadata = cached.metadata;
        onClose = cached.onClose;
    }
    else {
        const handlerModule = await Promise.resolve(`${entryPath}`).then(s => __importStar(require(s)));
        handler = handlerModule.default;
        if (!handler) {
            throw new Error(`Handler not found for ${entryPath}`);
        }
        metadata = handlerModule.metadata;
        if (!metadata) {
            throw new Error(`Metadata not found for ${entryPath}`);
        }
        onClose = handlerModule.onClose;
        Routes_1.routeCache.set(entryPath, { handler, metadata, onClose });
    }
    if (typeof handler !== "function") {
        throw new Error(`Handler is not a function for ${entryPath}`);
    }
    app.ws(routePath, {
        upgrade: async (response, request, context) => {
            const res = new Response_1.Response(response);
            const req = new Request_1.Request(response, request);
            req.params = (0, ws_1.parseParams)(routePath, req.url);
            try {
                if (!metadata) {
                    throw new Error(`Metadata not found for ${entryPath}`);
                }
                req.setMetadata(metadata);
            }
            catch (error) {
                (0, logger_1.logError)("websocket", error, entryPath);
                res.cork(async () => {
                    res.handleError(500, "Internal Server Error");
                });
                return;
            }
            try {
                if (metadata.requiresAuth) {
                    await (0, Middleware_1.rateLimit)(res, req, async () => {
                        await (0, Middleware_1.authenticate)(res, req, async () => {
                            await (0, Middleware_1.rolesGate)(app, res, req, routePath, "ws", async () => {
                                res.cork(async () => {
                                    res.upgrade({
                                        user: req.user,
                                        params: req.params,
                                        query: req.query,
                                        path: req.url,
                                    }, req.headers["sec-websocket-key"], req.headers["sec-websocket-protocol"], req.headers["sec-websocket-extensions"], context);
                                });
                            });
                        });
                    });
                }
                else {
                    res.cork(async () => {
                        var _a, _b;
                        res.upgrade({
                            user: {
                                id: ((_a = req.query) === null || _a === void 0 ? void 0 : _a.userId) || (0, passwords_1.makeUuid)(),
                                role: ((_b = req.query) === null || _b === void 0 ? void 0 : _b.userId) ? "user" : "guest",
                            },
                            params: req.params,
                            query: req.query,
                            path: req.url,
                        }, req.headers["sec-websocket-key"], req.headers["sec-websocket-protocol"], req.headers["sec-websocket-extensions"], context);
                    });
                }
            }
            catch (error) {
                (0, logger_1.logError)("websocket", error, entryPath);
                res.cork(async () => {
                    res.close();
                });
            }
        },
        open: (ws) => {
            if (!ws.user || typeof ws.user.id === "undefined") {
                console.error("User or user ID is undefined", ws.user);
                return;
            }
            const clientId = ws.user.id;
            (0, exports.addClient)(ws.path, clientId, ws, undefined);
        },
        message: async (ws, message, isBinary) => {
            const preparedMessage = Buffer.from(message).toString("utf-8");
            try {
                const parsedMessage = JSON.parse(preparedMessage);
                if (parsedMessage.action === "SUBSCRIBE" ||
                    parsedMessage.action === "UNSUBSCRIBE") {
                    handleSubscriptionChange(ws, parsedMessage);
                }
                const result = await handler(ws, parsedMessage, isBinary);
                if (result) {
                    (0, exports.sendMessageToClient)(ws.user.id, result);
                }
            }
            catch (error) {
                (0, logger_1.logError)("websocket", error, entryPath);
                console.error(`Failed to parse message: ${error}`);
            }
        },
        close: async (ws) => {
            (0, exports.removeClient)(ws.path, ws.user.id);
            if (typeof onClose === "function") {
                await onClose(ws, ws.path, ws.user.id);
            }
        },
    });
}
exports.handleWsMethod = handleWsMethod;
const addClient = (route, clientId, ws, subscription) => {
    if (!route || !clientId || !ws)
        return;
    if (!clients.has(route)) {
        clients.set(route, new Map());
    }
    const routeClients = clients.get(route);
    if (!routeClients.has(clientId)) {
        // Ensure only valid, non-empty subscriptions are added
        routeClients.set(clientId, {
            ws,
            subscriptions: new Set(subscription ? [subscription] : []),
        });
    }
    else {
        const clientDetails = routeClients.get(clientId);
        if (subscription) {
            clientDetails.subscriptions.add(subscription);
        }
    }
};
exports.addClient = addClient;
const removeClient = (route, clientId) => {
    if (clients.has(route)) {
        const routeClients = clients.get(route);
        routeClients.delete(clientId);
        if (routeClients.size === 0) {
            clients.delete(route);
        }
    }
};
exports.removeClient = removeClient;
const removeSubscription = (route, clientId, subscription) => {
    if (clients.has(route) && clients.get(route).has(clientId)) {
        const clientDetails = clients.get(route).get(clientId);
        clientDetails.subscriptions.delete(subscription);
        if (clientDetails.subscriptions.size === 0) {
            clients.get(route).delete(clientId);
            if (clients.get(route).size === 0) {
                clients.delete(route);
            }
        }
    }
};
exports.removeSubscription = removeSubscription;
function handleSubscriptionChange(ws, parsedMessage) {
    if (!parsedMessage.payload) {
        throw new Error("Invalid subscription payload");
    }
    const clientId = ws.user.id;
    const path = ws.path;
    // Use the stringified payload as the subscription key
    const subscription = JSON.stringify(parsedMessage.payload);
    switch (parsedMessage.action) {
        case "SUBSCRIBE":
            (0, exports.addClient)(path, clientId, ws, subscription);
            break;
        case "UNSUBSCRIBE":
            (0, exports.removeSubscription)(path, clientId, subscription);
            break;
        default:
            throw new Error(`Unsupported action: ${parsedMessage.action}`);
    }
}
const sendMessageToClient = (clientId, message, isBinary = false) => {
    const route = "/api/user";
    if (clients.has(route) && clients.get(route).has(clientId)) {
        const clientDetails = clients.get(route).get(clientId);
        try {
            clientDetails.ws.cork(() => {
                if (isBinary) {
                    // If the message should be sent as binary, we need to convert it to a buffer
                    const bufferMessage = Buffer.from(JSON.stringify(message));
                    clientDetails.ws.send(bufferMessage, true); // The second parameter indicates it's a binary message
                }
                else {
                    clientDetails.ws.send(JSON.stringify(message));
                }
            });
        }
        catch (error) {
            (0, logger_1.logError)("websocket", error, route);
            clients.get(route).delete(clientId);
        }
    }
    else {
        console.error(`Client ${clientId} not found in route ${route}`);
    }
};
exports.sendMessageToClient = sendMessageToClient;
const sendMessageToRoute = (route, payload, data) => {
    try {
        const subscription = JSON.stringify(payload);
        const message = JSON.stringify(data);
        if (clients.has(route)) {
            const routeClients = clients.get(route);
            routeClients.forEach((clientDetails) => {
                if (clientDetails.subscriptions.has(subscription)) {
                    try {
                        clientDetails.ws.cork(() => {
                            clientDetails.ws.send(message);
                        });
                    }
                    catch (error) {
                        (0, logger_1.logError)("websocket", error, route);
                    }
                }
            });
        }
    }
    catch (error) {
        console.log("Error in sendMessageToRoute", error);
    }
};
exports.sendMessageToRoute = sendMessageToRoute;
const sendMessageToRouteClients = (route, data) => {
    const message = JSON.stringify(data);
    if (clients.has(route)) {
        const routeClients = clients.get(route);
        routeClients.forEach((clientDetails) => {
            try {
                clientDetails.ws.cork(() => {
                    clientDetails.ws.send(message);
                });
            }
            catch (error) {
                (0, logger_1.logError)("websocket", error, route);
            }
        });
    }
};
exports.sendMessageToRouteClients = sendMessageToRouteClients;
const getClients = () => clients;
exports.getClients = getClients;
const hasClients = (route) => clients.has(route);
exports.hasClients = hasClients;
const getRouteClients = (route) => {
    if (clients.has(route)) {
        return clients.get(route);
    }
    return new Map();
};
exports.getRouteClients = getRouteClients;
const getRouteClient = (route, clientId) => {
    if (clients.has(route) && clients.get(route).has(clientId)) {
        return clients.get(route).get(clientId);
    }
    return null;
};
exports.getRouteClient = getRouteClient;
const getRouteClientSubscriptions = (route, clientId) => {
    if (clients.has(route) && clients.get(route).has(clientId)) {
        return clients.get(route).get(clientId).subscriptions;
    }
    return new Set();
};
exports.getRouteClientSubscriptions = getRouteClientSubscriptions;
const getRouteSubscriptions = (route) => {
    if (clients.has(route)) {
        const subscriptions = new Set();
        clients.get(route).forEach((clientDetails) => {
            clientDetails.subscriptions.forEach((subscription) => {
                subscriptions.add(subscription);
            });
        });
        return subscriptions;
    }
    return new Set();
};
exports.getRouteSubscriptions = getRouteSubscriptions;
const getRouteClientCount = (route) => {
    if (clients.has(route)) {
        return clients.get(route).size;
    }
    return 0;
};
exports.getRouteClientCount = getRouteClientCount;
/**
 * Utility function to handle WebSocket messages for announcements or notifications.
 *
 * @param {string} type - The type of message (e.g., "announcement" or "notification").
 * @param {string} model - The model name to fetch records from.
 * @param {string|string[]} id - The ID or array of IDs of the record(s).
 * @param {object} data - The data to update the record with.
 * @param {boolean | undefined} status - Flag indicating whether to fetch the full record from the database.
 *                                          - true: create
 *                                          - false: delete
 *                                          - undefined: update
 */
const handleRouteClientsMessage = async ({ type, model, id, data, method, status, }) => {
    let payload;
    const sendMessage = (method, payload) => {
        (0, exports.sendMessageToRouteClients)("/api/user", {
            type: type,
            method: method,
            payload,
        });
    };
    if (method === "update") {
        if (!id)
            throw new Error("ID is required for update method");
        if (status === true) {
            if (!model)
                throw new Error("Model is required for update method");
            // Fetch the full record to create
            if (Array.isArray(id)) {
                const records = await (0, query_1.getRecords)(model, id);
                if (!records || records.length === 0) {
                    throw new Error(`Records with IDs ${id.join(", ")} not found`);
                }
                payload = records;
            }
            else {
                const record = await (0, query_1.getRecord)(model, id);
                if (!record) {
                    throw new Error(`Record with ID ${id} not found`);
                }
                payload = record;
            }
            sendMessage("create", payload);
        }
        else if (status === false) {
            // Send a delete message
            sendMessage("delete", Array.isArray(id) ? id.map((id) => ({ id })) : { id: id });
        }
        else {
            // Send an update message
            payload = { id: id, data };
            sendMessage("update", payload);
        }
    }
    else {
        // Handle create or delete directly
        if (method === "create") {
            if (data) {
                payload = data;
            }
            else {
                if (!model || !id)
                    throw new Error("Model and ID are required for create method");
                if (Array.isArray(id)) {
                    const records = await (0, query_1.getRecords)(model, id);
                    if (!records || records.length === 0) {
                        throw new Error(`Records with IDs ${id.join(", ")} not found`);
                    }
                    payload = records;
                }
                else {
                    const record = await (0, query_1.getRecord)(model, id);
                    if (!record) {
                        throw new Error(`Record with ID ${id} not found`);
                    }
                    payload = record;
                }
            }
            sendMessage("create", payload);
        }
        else if (method === "delete") {
            if (!id)
                throw new Error("ID is required for update method");
            sendMessage("delete", Array.isArray(id) ? id.map((id) => ({ id })) : { id: id });
        }
    }
};
exports.handleRouteClientsMessage = handleRouteClientsMessage;
/**
 * Utility function to handle WebSocket messages for a specific client.
 *
 * @param {string} type - The type of message (e.g., "announcement" or "notification").
 * @param {string} clientId - The ID of the client to send the message to.
 * @param {string} model - The model name to fetch records from.
 * @param {string|string[]} id - The ID or array of IDs of the record(s).
 * @param {object} data - The data to update the record with.
 * @param {boolean | undefined} status - Flag indicating whether to fetch the full record from the database.
 *                                          - true: create
 *                                          - false: delete
 *                                          - undefined: update
 */
const handleClientMessage = async ({ type, clientId, model, id, data, method, status, }) => {
    let payload;
    const sendMessage = (method, payload) => {
        (0, exports.sendMessageToClient)(clientId, {
            type: type,
            method: method,
            payload,
        });
    };
    if (method === "update") {
        if (!id)
            throw new Error("ID is required for update method");
        if (status === true) {
            if (!model)
                throw new Error("Model is required for update method");
            // Fetch the full record to create
            if (Array.isArray(id)) {
                const records = await (0, query_1.getRecords)(model, id);
                if (!records || records.length === 0) {
                    throw new Error(`Records with IDs ${id.join(", ")} not found`);
                }
                payload = records;
            }
            else {
                const record = await (0, query_1.getRecord)(model, id);
                if (!record) {
                    throw new Error(`Record with ID ${id} not found`);
                }
                payload = record;
            }
            sendMessage("create", payload);
        }
        else if (status === false) {
            // Send a delete message
            sendMessage("delete", Array.isArray(id) ? id.map((id) => ({ id })) : { id: id });
        }
        else {
            // Send an update message
            payload = { id: id, data };
            sendMessage("update", payload);
        }
    }
    else {
        // Handle create or delete directly
        if (method === "create") {
            if (data) {
                payload = data;
            }
            else {
                if (!model || !id)
                    throw new Error("Model and ID are required for create method");
                if (Array.isArray(id)) {
                    const records = await (0, query_1.getRecords)(model, id);
                    if (!records || records.length === 0) {
                        throw new Error(`Records with IDs ${id.join(", ")} not found`);
                    }
                    payload = records;
                }
                else {
                    const record = await (0, query_1.getRecord)(model, id);
                    if (!record) {
                        throw new Error(`Record with ID ${id} not found`);
                    }
                    payload = record;
                }
            }
            sendMessage("create", payload);
        }
        else if (method === "delete") {
            if (!id)
                throw new Error("ID is required for delete method");
            sendMessage("delete", Array.isArray(id) ? id.map((id) => ({ id })) : { id: id });
        }
    }
};
exports.handleClientMessage = handleClientMessage;
