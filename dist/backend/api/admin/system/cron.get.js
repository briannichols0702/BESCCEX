"use strict";
// /server/api/cron/index.get.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const cron_1 = __importDefault(require("@b/utils/cron"));
exports.metadata = {
    summary: "Run the cron job",
    operationId: "runCron",
    tags: ["Admin", "Cron"],
    description: "Runs the cron job to process pending tasks.",
    responses: {
        200: {
            description: "Cron job run successfully",
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
        400: {
            description: "Error running cron job",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Error message",
                            },
                        },
                    },
                },
            },
        },
    },
    permission: "Access Admin Dashboard",
};
exports.default = async () => {
    const cronJobManager = await cron_1.default.getInstance();
    const cronJobs = cronJobManager.getCronJobs();
    return cronJobs.map((job) => {
        return {
            name: job.name,
            title: job.title,
            period: job.period,
            description: job.description,
            lastRun: job.lastRun,
        };
    });
};
