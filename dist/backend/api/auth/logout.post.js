"use strict";
// /server/api/auth/logout.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const token_1 = require("@b/utils/token");
exports.metadata = {
    summary: "Logs out the current user",
    operationId: "logoutUser",
    tags: ["Auth"],
    description: "Logs out the current user and clears all session tokens",
    requiresAuth: true,
    responses: {
        200: {
            description: "User logged out successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, no user to log out",
        },
    },
};
exports.default = async (data) => {
    await (0, token_1.deleteSession)(data.cookies.sessionId);
    data.setUser(null);
    return {
        message: "You have been logged out",
        cookies: {
            accessToken: "",
            refreshToken: "",
            sessionId: "",
            csrfToken: "",
        },
    };
};
