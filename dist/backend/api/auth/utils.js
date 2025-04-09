"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.getChainIdFromMessage = exports.getAddressFromMessage = exports.verifyRecaptcha = exports.addOneTimeToken = exports.generateNewPassword = exports.createSessionAndReturnResponse = exports.updateUser = exports.createUser = exports.getOrCreateUserRole = exports.validateEmail = exports.getUserByWalletAddress = exports.verifyResetTokenQuery = exports.sendEmailVerificationToken = exports.userInclude = exports.returnUserWithTokens = exports.userRegisterSchema = exports.userRegisterResponseSchema = void 0;
// ./http/auth/queries.ts
const error_1 = require("@b/utils/error");
const passwords_1 = require("@b/utils/passwords");
const db_1 = require("@b/db");
const token_1 = require("@b/utils/token");
const generate_password_1 = __importDefault(require("generate-password"));
const utils_1 = require("@walletconnect/utils");
const emails_1 = require("@b/utils/emails");
exports.userRegisterResponseSchema = {
    message: {
        type: "string",
        description: "Success message",
    },
    cookies: {
        type: "object",
        properties: {
            accessToken: {
                type: "string",
                description: "Access token",
            },
            sessionId: {
                type: "string",
                description: "Session ID",
            },
            csrfToken: {
                type: "string",
                description: "CSRF token",
            },
        },
    },
};
exports.userRegisterSchema = {
    type: "object",
    properties: {
        token: {
            type: "string",
            description: "Google OAuth token",
        },
        ref: {
            type: "string",
            description: "Referral code",
        },
    },
    required: ["token"],
};
const returnUserWithTokens = async ({ user, message }) => {
    // Prepare user data for token generation, excluding sensitive information
    const publicUser = {
        id: user.id,
        role: user.roleId,
    };
    // Generate tokens and CSRF token
    const { accessToken, refreshToken, csrfToken, sessionId } = await (0, token_1.generateTokens)(publicUser);
    await (0, token_1.createSession)(publicUser.id, publicUser.role, accessToken, csrfToken, refreshToken);
    return {
        message,
        cookies: {
            accessToken: accessToken,
            sessionId: sessionId,
            csrfToken: csrfToken,
        },
    };
};
exports.returnUserWithTokens = returnUserWithTokens;
exports.userInclude = {
    include: [
        {
            model: db_1.models.role,
            as: "role",
            attributes: ["id", "name"],
            include: [
                {
                    model: db_1.models.rolePermission,
                    as: "rolePermissions",
                    include: [
                        {
                            model: db_1.models.permission,
                            as: "permission",
                        },
                    ],
                },
            ],
        },
        {
            model: db_1.models.twoFactor,
            attributes: ["type", "enabled"],
        },
        {
            model: db_1.models.kyc,
            attributes: ["status", "level"],
        },
        {
            model: db_1.models.author,
            attributes: ["status"],
        },
    ],
};
// send email verification token
const sendEmailVerificationToken = async (userId, email) => {
    const user = await db_1.models.user.findOne({
        where: { email, id: userId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const token = await (0, token_1.generateEmailCode)(user.id);
    try {
        await emails_1.emailQueue.add({
            emailData: {
                TO: user.email,
                FIRSTNAME: user.firstName,
                CREATED_AT: user.createdAt,
                TOKEN: token,
            },
            emailType: "EmailVerification",
        });
        return {
            message: "Email with verification code sent successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            message: error.message,
            statusCode: 500,
        });
    }
};
exports.sendEmailVerificationToken = sendEmailVerificationToken;
// verify email token
const verifyResetTokenQuery = async (token) => {
    const decodedToken = await (0, token_1.verifyResetToken)(token);
    if (!decodedToken || !decodedToken.sub) {
        throw new Error("Invalid or malformed token");
    }
    // Check if the `jti` field matches the one-time token logic
    const jtiCheck = await addOneTimeToken(decodedToken.jti, new Date());
    if (decodedToken.jti !== jtiCheck) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Server error: Invalid JTI in the token",
        });
    }
    try {
        // Check if `sub.id` exists before using it
        if (!decodedToken.sub.id) {
            throw new Error("Malformed token: Missing sub.id");
        }
        // Proceed to update the user's verification status
        await db_1.models.user.update({
            emailVerified: true,
        }, {
            where: {
                id: decodedToken.sub.id,
            },
        });
        return {
            message: "Token verified successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Server error: ${error.message}`,
        });
    }
};
exports.verifyResetTokenQuery = verifyResetTokenQuery;
const getUserByWalletAddress = async (walletAddress) => {
    const user = (await db_1.models.user.findOne({
        where: { walletAddress: walletAddress },
        include: exports.userInclude,
    }));
    if (user) {
        // Destructure to exclude the password and return the rest of the user object
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};
exports.getUserByWalletAddress = getUserByWalletAddress;
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}
exports.validateEmail = validateEmail;
async function getOrCreateUserRole() {
    // Implementation for role retrieval/creation
    await db_1.models.role.upsert({
        name: "User",
    });
    return await db_1.models.role.findOne({
        where: {
            name: "User",
        },
    });
}
exports.getOrCreateUserRole = getOrCreateUserRole;
async function createUser(userData) {
    // Implementation for creating a new user
    return await db_1.models.user.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.hashedPassword,
        emailVerified: true,
        roleId: userData.role.id,
    });
}
exports.createUser = createUser;
async function updateUser(userId, updateData) {
    // Implementation for updating an existing user
    await db_1.models.user.update({
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        password: updateData.hashedPassword,
        emailVerified: true,
    }, {
        where: { id: userId },
    });
}
exports.updateUser = updateUser;
async function createSessionAndReturnResponse(user) {
    // Implementation for creating session, generating tokens, and returning response
    const publicUser = {
        id: user.id,
        role: user.roleId,
    };
    const accessToken = await (0, token_1.generateAccessToken)(publicUser);
    const refreshToken = await (0, token_1.generateRefreshToken)(publicUser);
    const csrfToken = (0, token_1.generateCsrfToken)();
    const session = await (0, token_1.createSession)(user.id, user.roleId, accessToken, csrfToken, refreshToken);
    return {
        message: "You have been logged in successfully",
        cookies: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            sessionId: session.sid,
            csrfToken: csrfToken,
        },
    };
}
exports.createSessionAndReturnResponse = createSessionAndReturnResponse;
async function generateNewPassword(id) {
    // Generate secure password consistent with password policy
    const password = generate_password_1.default.generate({
        length: 20,
        numbers: true,
        symbols: true,
        strict: true,
    });
    // Check if password passes password policy
    const isValidPassword = (0, passwords_1.validatePassword)(password);
    if (!isValidPassword) {
        return (0, error_1.createError)({
            statusCode: 500,
            message: "Server error",
        });
    }
    // Hash password
    const errorOrHashedPassword = await (0, passwords_1.hashPassword)(password);
    const hashedPassword = errorOrHashedPassword;
    try {
        await db_1.models.user.update({
            password: hashedPassword,
        }, {
            where: {
                id,
            },
        });
        return password;
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Server error",
        });
    }
}
exports.generateNewPassword = generateNewPassword;
async function addOneTimeToken(tokenId, expiresAt) {
    try {
        await db_1.models.oneTimeToken.create({
            tokenId: tokenId,
            expiresAt: expiresAt,
        });
        return tokenId;
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Server error",
        });
    }
}
exports.addOneTimeToken = addOneTimeToken;
const verifyRecaptcha = async (token) => {
    const secretKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
    });
    const data = await response.json();
    return data.success;
};
exports.verifyRecaptcha = verifyRecaptcha;
const ETH_ADDRESS_PATTERN = /0x[a-fA-F0-9]{40}/u;
const ETH_CHAIN_ID_IN_SIWE_PATTERN = /Chain ID: (?<temp1>\d+)/u;
function getAddressFromMessage(message) {
    var _a;
    return ((_a = message.match(ETH_ADDRESS_PATTERN)) === null || _a === void 0 ? void 0 : _a[0]) || "";
}
exports.getAddressFromMessage = getAddressFromMessage;
function getChainIdFromMessage(message) {
    var _a;
    return `eip155:${((_a = message.match(ETH_CHAIN_ID_IN_SIWE_PATTERN)) === null || _a === void 0 ? void 0 : _a[1]) || 1}`;
}
exports.getChainIdFromMessage = getChainIdFromMessage;
async function verifySignature({ address, message, signature, chainId, projectId, }) {
    // isValidEip191Signature returns a boolean synchronously.
    let isValid = (0, utils_1.isValidEip191Signature)(address, message, signature);
    if (!isValid) {
        // isValidEip1271Signature returns a Promise<boolean>, so we must await it.
        isValid = await (0, utils_1.isValidEip1271Signature)(address, message, signature, chainId, projectId);
    }
    return isValid;
}
exports.verifySignature = verifySignature;
