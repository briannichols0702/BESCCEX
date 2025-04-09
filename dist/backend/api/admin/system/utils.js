"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadUpdate = exports.checkUpdate = exports.checkLatestVersion = exports.activateLicense = exports.verifyLicense = exports.callApi = exports.getPublicIp = exports.fetchPublicIp = exports.getBlockchain = exports.getProduct = void 0;
const https_1 = __importDefault(require("https"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = require("fs");
const fs_2 = require("fs");
const system_1 = require("../../../utils/system");
const db_1 = require("@b/db");
let cachedIP = null;
let lastFetched = null;
let nextVerificationDate = null;
const verificationPeriodDays = 3;
const rootPath = process.cwd();
const licFolderPath = `${rootPath}/lic`;
async function getProduct(id) {
    if (id) {
        const extension = await db_1.models.extension.findOne({
            where: { productId: id },
        });
        if (!extension) {
            throw new Error("Extension not found");
        }
        return extension;
    }
    else {
        try {
            const filePath = `${rootPath}/package.json`;
            const fileContent = await fs_1.promises.readFile(filePath, "utf8");
            const content = JSON.parse(fileContent);
            if (!content) {
                throw new Error("Error reading package.json");
            }
            return {
                id: content.id,
                name: content.name,
                version: content.version,
                description: content.description,
            };
        }
        catch (error) {
            console.error(`Error getting product: ${error.message}`);
            throw new Error(error.message);
        }
    }
}
exports.getProduct = getProduct;
async function getBlockchain(id) {
    const blockchain = await db_1.models.ecosystemBlockchain.findOne({
        where: { productId: id },
    });
    if (!blockchain) {
        throw new Error("Blockchain not found");
    }
    return blockchain;
}
exports.getBlockchain = getBlockchain;
async function fetchPublicIp() {
    try {
        const data = await new Promise((resolve, reject) => {
            https_1.default.get("https://api.ipify.org?format=json", (resp) => {
                let data = "";
                resp.on("data", (chunk) => {
                    data += chunk;
                });
                resp.on("end", () => {
                    resolve(JSON.parse(data));
                });
                resp.on("error", (err) => {
                    reject(err);
                });
            });
        });
        return data.ip;
    }
    catch (error) {
        console.error(`Error fetching public IP: ${error.message}`);
        return null;
    }
}
exports.fetchPublicIp = fetchPublicIp;
async function getPublicIp() {
    const now = Date.now();
    if (cachedIP && lastFetched && now - lastFetched < 60000) {
        // 1 minute cache
        return cachedIP;
    }
    cachedIP = await fetchPublicIp();
    lastFetched = now;
    return cachedIP;
}
exports.getPublicIp = getPublicIp;
async function callApi(method, url, data = null, filename) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "LB-API-KEY": process.env.API_LICENSE_API_KEY || "",
            "LB-URL": process.env.NEXT_PUBLIC_SITE_URL || "",
            "LB-IP": (await getPublicIp()) || "",
            "LB-LANG": "en",
        };
        const requestData = data ? JSON.stringify(data) : null;
        const requestOptions = {
            method: method,
            headers: headers,
        };
        const response = await new Promise((resolve, reject) => {
            const req = https_1.default.request(url, requestOptions, (res) => {
                const data = [];
                if (res.headers["content-type"] === "application/zip") {
                    if (!filename) {
                        reject(new Error("Filename must be provided for zip content."));
                        return;
                    }
                    const dirPath = `${rootPath}/updates`;
                    const filePath = `${dirPath}/${filename}.zip`;
                    // Ensure the directory exists
                    fs_1.promises.mkdir(dirPath, { recursive: true })
                        .then(() => {
                        const fileStream = (0, fs_2.createWriteStream)(filePath);
                        res.pipe(fileStream);
                        fileStream.on("finish", () => {
                            resolve({
                                status: true,
                                message: "Update file downloaded successfully",
                                path: filePath,
                            });
                        });
                        fileStream.on("error", (err) => {
                            reject(err);
                        });
                    })
                        .catch((err) => {
                        reject(err);
                    });
                }
                else {
                    res.on("data", (chunk) => {
                        data.push(chunk);
                    });
                    res.on("end", () => {
                        const result = JSON.parse(Buffer.concat(data).toString());
                        if (res.statusCode !== 200) {
                            reject(new Error(result.message));
                        }
                        else {
                            resolve(result);
                        }
                    });
                }
                res.on("error", (err) => {
                    reject(err);
                });
            });
            req.on("error", (err) => {
                reject(err);
            });
            if (requestData) {
                req.write(requestData);
            }
            req.end();
        });
        return response;
    }
    catch (error) {
        console.error(`API call failed: ${error.message}`);
        throw new Error(error.message);
    }
}
exports.callApi = callApi;
async function verifyLicense(productId, license, client, timeBasedCheck) {
    const licenseFilePath = `${licFolderPath}/${productId}.lic`;
    let data;
    try {
        // Check if a license file exists
        const licenseFileContent = await fs_1.promises.readFile(licenseFilePath, "utf8");
        data = {
            product_id: productId,
            license_file: licenseFileContent,
            license_code: null,
            client_name: null,
        };
    }
    catch (err) {
        console.error(`Error reading license file: ${err.message}`);
        // File does not exist or other error occurred
        data = {
            product_id: productId,
            license_file: null,
            license_code: license,
            client_name: client,
        };
    }
    if (timeBasedCheck && verificationPeriodDays > 0) {
        const today = new Date();
        if (nextVerificationDate && today < nextVerificationDate) {
            return { status: true, message: "Verified from cache" };
        }
    }
    const response = await callApi("POST", `${process.env.APP_LICENSE_API_URL}/api/verify_license`, data);
    if (timeBasedCheck && verificationPeriodDays > 0 && response.status) {
        const today = new Date();
        nextVerificationDate = new Date();
        nextVerificationDate.setDate(today.getDate() + verificationPeriodDays);
    }
    if (!response.status) {
        console.error(`License verification failed: ${response.message}`);
        throw new Error(response.message);
    }
    return response;
}
exports.verifyLicense = verifyLicense;
async function activateLicense(productId, license, client) {
    const data = {
        product_id: productId,
        license_code: license,
        client_name: client,
        verify_type: "envato",
    };
    const response = await callApi("POST", `${process.env.APP_LICENSE_API_URL}/api/activate_license`, data);
    if (!response.status) {
        console.error(`License activation failed: ${response.message}`);
        throw new Error(response.message);
    }
    // If activation is successful, save the license
    if (response.lic_response) {
        const licFileContent = response.lic_response;
        const licenseFilePath = `${licFolderPath}/${productId}.lic`;
        // Ensure the lic directory exists
        await fs_1.promises.mkdir(licFolderPath, { recursive: true });
        // Save the license to a file in the lic directory
        await fs_1.promises.writeFile(licenseFilePath, licFileContent);
    }
    return response;
}
exports.activateLicense = activateLicense;
async function checkLatestVersion(productId) {
    const payload = {
        product_id: productId,
    };
    return await callApi("POST", `${process.env.APP_LICENSE_API_URL}/api/latest_version`, payload);
}
exports.checkLatestVersion = checkLatestVersion;
async function checkUpdate(productId, currentVersion) {
    const payload = {
        product_id: productId,
        current_version: currentVersion,
    };
    return await callApi("POST", `${process.env.APP_LICENSE_API_URL}/api/check_update`, payload);
}
exports.checkUpdate = checkUpdate;
async function downloadUpdate(productId, updateId, version, product, type) {
    if (!productId || !updateId || !version || !product) {
        throw new Error("Missing required arguments.");
    }
    const licenseFilePath = `${licFolderPath}/${productId}.lic`;
    const licenseFile = await fs_1.promises.readFile(licenseFilePath, "utf8");
    const data = {
        license_file: licenseFile,
        license_code: null,
        client_name: null,
    };
    // Call API to download update
    const response = await callApi("POST", `${process.env.APP_LICENSE_API_URL}/api/download_update/main/${updateId}`, data, `${product}-${version}`);
    if (!response.status) {
        throw new Error(`Download failed: ${response.message}`);
    }
    if (!response.path) {
        throw new Error(`Download failed: No update file path returned.`);
    }
    try {
        // Extract the main update
        unzip(response.path, rootPath);
        if (type === "extension") {
            try {
                await (0, system_1.updateExtensionQuery)(productId, version);
            }
            catch (error) {
                throw new Error(`Update of extension version failed: ${error.message}`);
            }
        }
        else if (type === "blockchain") {
            try {
                await (0, system_1.updateBlockchainQuery)(productId, version);
            }
            catch (error) {
                throw new Error(`Update of blockchain version failed: ${error.message}`);
            }
        }
        // Remove the zip file after successful extraction
        await fs_1.promises.unlink(response.path);
        return {
            message: "Update downloaded and extracted successfully",
            status: true,
        };
    }
    catch (error) {
        throw new Error(`Extraction of update files failed: ${error.message}`);
    }
}
exports.downloadUpdate = downloadUpdate;
const unzip = (filePath, outPath) => {
    const zip = new adm_zip_1.default(filePath);
    zip.extractAllTo(outPath, true);
};
