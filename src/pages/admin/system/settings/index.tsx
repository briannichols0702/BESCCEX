import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import { useDashboardStore } from "@/stores/dashboard";
import { BackButton } from "@/components/elements/base/button/BackButton";
import $fetch from "@/utils/api";
import { imageUploader } from "@/utils/upload";
import { useTranslation } from "next-i18next";
import Tabs from "@/components/pages/admin/settings/Tabs";
import GeneralSection from "@/components/pages/admin/settings/section/General";
import RestrictionsSection from "@/components/pages/admin/settings/section/Restrictions";
import WalletSection from "@/components/pages/admin/settings/section/Wallet";
import LogosSection from "@/components/pages/admin/settings/section/Logo";
import InvestmentSection from "@/components/pages/admin/settings/section/Investment";
import P2PSection from "@/components/pages/admin/settings/section/P2P";
import AffiliateSection from "@/components/pages/admin/settings/section/Affiliate";
import SocialLinksSection from "@/components/pages/admin/settings/section/Social";
import AnimationsSection from "@/components/pages/admin/settings/section/Animations";

const initialFormData = {
  blogPostLayout: "DEFAULT",
  mlmSystem: "DIRECT",
  binaryLevels: 2,
  unilevelLevels: 2,
  lottieAnimationStatus: true,
  mobileVerificationLottieEnabled: true,
  appVerificationLottieEnabled: true,
  emailVerificationLottieEnabled: true,
  loginLottieEnabled: true,
  investmentLottieEnabled: true,
  icoLottieEnabled: true,
  ecommerceLottieEnabled: true,
  affiliateLottieEnabled: true,
  binaryLottieEnabled: true,
  forexLottieEnabled: true,
  investmentPlansLottieEnabled: true,
  stakingLottieEnabled: true,
};

interface ImageField {
  name: string;
  dir: string;
  size: {
    width?: number;
    height?: number;
    maxWidth: number;
    maxHeight: number;
  };
}

const SystemSettings: React.FC = () => {
  const { t } = useTranslation();
  const { settings, isFetched } = useDashboardStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [originalData, setOriginalData] = useState(initialFormData);
  const [changes, setChanges] = useState({});
  const [mainTab, setMainTab] = useState<string | null>(null);
  const [shouldSave, setShouldSave] = useState(false);
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);

  const initializeFormData = useCallback((settings) => {
    const newFormData: any = { ...initialFormData, ...settings };
    if (settings.mlmSettings) {
      try {
        const mlmSettings = JSON.parse(settings.mlmSettings);
        if (mlmSettings.binary) {
          newFormData.binaryLevels = mlmSettings.binary.levels;
          mlmSettings.binary.levelsPercentage.forEach(
            (level: { level: number; value: number }) => {
              newFormData[`binaryLevel${level.level}`] = level.value;
            }
          );
        } else if (mlmSettings.unilevel) {
          newFormData.unilevelLevels = mlmSettings.unilevel.levels;
          mlmSettings.unilevel.levelsPercentage.forEach(
            (level: { level: number; value: number }) => {
              newFormData[`unilevelLevel${level.level}`] = level.value;
            }
          );
        }
      } catch (error) {
        console.error("Error parsing mlmSettings:", error);
      }
    }

    setFormData(newFormData);
    setOriginalData(newFormData);
  }, []);

  useEffect(() => {
    const { tab } = router.query;
    if (tab) {
      const activeTab = Array.isArray(tab) ? tab[0] : tab;
      setMainTab(activeTab.toUpperCase());
    } else {
      // If no tab in query, set default and update URL
      handleTabChange("GENERAL");
    }
  }, [router.query]);

  useEffect(() => {
    if (isFetched && settings && router.isReady) {
      initializeFormData(settings);
      checkRestrictions(settings);
    }
  }, [isFetched, settings, router.isReady, initializeFormData]);

  const handleTabChange = useCallback(
    (newTab: string) => {
      setMainTab(newTab);
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: newTab.toLowerCase() },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  useEffect(() => {
    if (shouldSave) {
      handleSave();
      setShouldSave(false);
    }
  }, [shouldSave]);

  const checkRestrictions = async (settings) => {
    const restrictions = [
      settings.tradeRestrictions,
      settings.binaryRestrictions,
      settings.forexRestrictions,
      settings.botRestrictions,
      settings.icoRestrictions,
      settings.mlmRestrictions,
      settings.walletRestrictions,
      settings.depositRestrictions,
      settings.withdrawalRestrictions,
      settings.ecommerceRestrictions,
      settings.stakingRestrictions,
    ];

    if (restrictions.some((restriction) => restriction)) {
      const { data, error } = await $fetch({
        url: "/api/user/kyc/template",
        silent: true,
      });
      if (data) {
        setKycStatus(true);
      } else {
        setKycStatus(false);
      }
    }
  };

  const handleInputChange = ({
    name,
    value,
    save = false,
  }: {
    name: string;
    value: any;
    save?: boolean;
  }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setChanges((prev) => ({ ...prev, [name]: value }));
    if (save) setShouldSave(true);
  };

  const handleFileChange = async (files: FileList, field: ImageField) => {
    if (files.length > 0) {
      const file = files[0];
      try {
        const uploadResult = await imageUploader({
          file,
          dir: field.dir,
          size: field.size,
          oldPath: formData[field.name] || undefined,
        });
        if (uploadResult.success) {
          handleInputChange({
            name: field.name,
            value: uploadResult.url,
            save: true,
          });
        }
      } catch (error) {
        console.error("File upload failed", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setChanges({});
  };

  const handleSave = async () => {
    setIsLoading(true);

    const mlmSettings =
      formData.mlmSystem === "BINARY"
        ? {
            binary: {
              levels: formData.binaryLevels,
              levelsPercentage: Array.from(
                { length: formData.binaryLevels },
                (_, i) => ({
                  level: i + 1,
                  value: formData[`binaryLevel${i + 1}`] || 0,
                })
              ),
            },
          }
        : {
            unilevel: {
              levels: formData.unilevelLevels,
              levelsPercentage: Array.from(
                { length: formData.unilevelLevels },
                (_, i) => ({
                  level: i + 1,
                  value: formData[`unilevelLevel${i + 1}`] || 0,
                })
              ),
            },
          };

    const newSettings = {
      ...formData,
      mlmSettings: JSON.stringify(mlmSettings),
    };

    try {
      const { error } = await $fetch({
        url: "/api/admin/system/settings",
        method: "PUT",
        body: newSettings,
      });

      if (!error) {
        setOriginalData(formData);
        setChanges({});
      }
    } catch (error) {
      console.error("Failed to save settings", error);
    }
    setIsLoading(false);
  };

  const hasChanges = Object.keys(changes).length > 0;

  if (!settings) return null;

  const renderSection = () => {
    if (mainTab === null) return null;

    const sectionProps = {
      formData,
      handleInputChange,
      handleFileChange,
      handleCancel,
      handleSave,
      hasChanges,
      isLoading,
    };

    switch (mainTab) {
      case "GENERAL":
        return <GeneralSection {...sectionProps} />;
      case "RESTRICTIONS":
        return <RestrictionsSection {...sectionProps} kycStatus={kycStatus} />;
      case "WALLET":
        return <WalletSection {...sectionProps} />;
      case "ANIMATIONS":
        return <AnimationsSection {...sectionProps} />;
      case "LOGOS":
        return <LogosSection {...sectionProps} />;
      case "INVEST":
        return <InvestmentSection {...sectionProps} />;
      case "P2P":
        return <P2PSection {...sectionProps} />;
      case "AFFILIATE":
        return <AffiliateSection {...sectionProps} />;
      case "SOCIAL":
        return <SocialLinksSection {...sectionProps} />;
      default:
        return null;
    }
  };

  if (!settings || mainTab === null) return null;

  return (
    <Layout title={t("System Settings")} color="muted">
      <main className="mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="font-sans text-2xl font-light leading-[1.125] text-muted-800 dark:text-muted-100">
            {t("Settings")}
          </h2>
          <BackButton href="/admin/dashboard" />
        </div>
        <div className="w-full h-full flex flex-col">
          <Tabs mainTab={mainTab} setMainTab={setMainTab} />
          <div className="w-full flex p-4 flex-col h-full">
            {renderSection()}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SystemSettings;
export const permission = "Access System Settings Management";
