"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMailwizardCampaignStatus = exports.updateMailwizardCampaignTargets = exports.processMailwizardCampaigns = void 0;
const db_1 = require("@b/db");
const logger_1 = require("../logger");
const emails_1 = require("../emails");
async function processMailwizardCampaigns() {
    try {
        const campaigns = await db_1.models.mailwizardCampaign.findAll({
            where: { status: "ACTIVE" },
            include: [
                {
                    model: db_1.models.mailwizardTemplate,
                    as: "template",
                },
            ],
        });
        for (const campaign of campaigns) {
            let sentCount = 0;
            if (!campaign.targets)
                continue;
            let targets = [];
            try {
                targets = JSON.parse(campaign.targets);
            }
            catch (error) {
                (0, logger_1.logError)(`processMailwizardCampaigns`, error, __filename);
                continue;
            }
            for (const target of targets) {
                if (target.status === "PENDING" && sentCount < campaign.speed) {
                    try {
                        await (0, emails_1.sendEmailToTargetWithTemplate)(target.email, campaign.subject, campaign.template.content);
                        target.status = "SENT";
                        sentCount++;
                    }
                    catch (error) {
                        (0, logger_1.logError)(`processMailwizardCampaigns`, error, __filename);
                        target.status = "FAILED";
                    }
                }
            }
            try {
                await updateMailwizardCampaignTargets(campaign.id, JSON.stringify(targets));
                if (targets.every((target) => target.status !== "PENDING")) {
                    await updateMailwizardCampaignStatus(campaign.id, "COMPLETED");
                }
            }
            catch (error) {
                (0, logger_1.logError)(`processMailwizardCampaigns`, error, __filename);
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("processMailwizardCampaigns", error, __filename);
        throw error;
    }
}
exports.processMailwizardCampaigns = processMailwizardCampaigns;
async function updateMailwizardCampaignTargets(id, targets) {
    try {
        await db_1.models.mailwizardCampaign.update({ targets }, {
            where: { id },
        });
    }
    catch (error) {
        (0, logger_1.logError)(`updateMailwizardCampaignTargets`, error, __filename);
        throw error;
    }
}
exports.updateMailwizardCampaignTargets = updateMailwizardCampaignTargets;
async function updateMailwizardCampaignStatus(id, status) {
    try {
        await db_1.models.mailwizardCampaign.update({ status }, {
            where: { id },
        });
    }
    catch (error) {
        (0, logger_1.logError)(`updateMailwizardCampaignStatus`, error, __filename);
        throw error;
    }
}
exports.updateMailwizardCampaignStatus = updateMailwizardCampaignStatus;
