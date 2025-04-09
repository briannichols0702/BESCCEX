"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.metadata = {
    summary: "Run the cron job",
    operationId: "runCron",
    tags: ["Cron"],
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
};
exports.default = async () => {
    return { message: "this cron is not needed anymore." };
};
