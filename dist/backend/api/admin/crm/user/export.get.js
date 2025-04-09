"use strict";
// /server/api/admin/users/export.get.ts
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
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.metadata = {
    summary: "Export all users as an Excel file with detailed information",
    operationId: "exportUsersToExcel",
    tags: ["Admin", "CRM", "User"],
    responses: {
        200: {
            description: "Excel file created successfully",
        },
    },
    requiresAuth: true,
    permission: "Access User Management",
};
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized access" });
    }
    // Fetch all user details with associations
    const users = await db_1.models.user.findAll({
        include: [
            { model: db_1.models.role, as: "role" },
            { model: db_1.models.kyc, as: "kyc" },
        ],
    });
    // Prepare data for Excel
    const userData = users.map((user) => {
        var _a, _b, _c, _d;
        return ({
            ID: user.id,
            FirstName: user.firstName || "N/A",
            LastName: user.lastName || "N/A",
            Email: user.email || "N/A",
            EmailVerified: user.emailVerified ? "Yes" : "No",
            Phone: user.phone || "N/A",
            Role: ((_a = user.role) === null || _a === void 0 ? void 0 : _a.name) || "N/A",
            Status: user.status,
            KYC_Status: ((_b = user.kyc) === null || _b === void 0 ? void 0 : _b.status) || "N/A",
            CreatedAt: ((_c = user.createdAt) === null || _c === void 0 ? void 0 : _c.toISOString()) || "N/A",
            LastLogin: ((_d = user.lastLogin) === null || _d === void 0 ? void 0 : _d.toISOString()) || "N/A",
        });
    });
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    // Set file path and name
    const filePath = path.join(process.cwd(), "exports", "users.xlsx");
    // Create directory if not exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // Write to the file
    XLSX.writeFile(workbook, filePath);
    return {
        message: `Excel file created successfully at ${filePath}`,
    };
};
