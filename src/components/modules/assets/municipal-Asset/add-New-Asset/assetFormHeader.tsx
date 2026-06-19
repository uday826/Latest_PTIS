"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { AssetStepper } from "@/components/modules/assets/municipal-Asset/add-New-Asset/assetStepper";
import { getFilteredSteps, getCurrentAssetStep, type CategoryFlags } from "@/components/modules/assets/municipal-Asset/add-New-Asset/assetFormSteps";

const AssetFormFooter = dynamic(
  () => import("./assetFormFooter").then((mod) => mod.AssetFormFooter),
  { ssr: false }
);
import { Home, PencilLine } from "lucide-react";

import { AssetFormProvider, useAssetForm } from "@/components/modules/assets/municipal-Asset/add-New-Asset/AssetFormContext";

import { useTranslations } from "next-intl";

interface AssetFormHeaderProps {
  children: React.ReactNode;
}

export function AssetFormHeader({ children }: AssetFormHeaderProps) {
  return (
    <AssetFormProvider>
      <AssetFormHeaderContent>{children}</AssetFormHeaderContent>
    </AssetFormProvider>
  );
}

function AssetFormHeaderContent({ children }: AssetFormHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formData } = useAssetForm();
  const t = useTranslations("addAssetForm");

  const isEditMode = searchParams.get('mode') === 'edit';
  const assetCode = searchParams.get('assetCode') || formData.assetCode || '';

  const categoryFlags: CategoryFlags | undefined =
    formData.hasFloorDetails !== undefined ? {
      isMovable: formData.isMovableCategory,
      hasFloorDetails: formData.hasFloorDetails,
      hasInventory: formData.hasInventory,
      isInventoryMandatory: formData.isInventoryMandatory,
      hasLegalCompliance: formData.hasLegalCompliance,
    } : undefined;

  const steps = getFilteredSteps(formData.category, formData.assetType, formData.parentBuildingId, categoryFlags);
  const currentStep = getCurrentAssetStep(pathname, formData.category, formData.assetType, formData.parentBuildingId, categoryFlags);

  const handleBackToDashboard = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("newAssetFormData");
    }
    const segments = pathname.split("/").filter(Boolean);
    const locale = segments[0] || "en";
    router.push(`/${locale}/assets/municipal-Asset`);
  };

  const isRootDrawer = pathname.endsWith('/add-New-Asset') || pathname.endsWith('/add-New-Asset/');

  if (isRootDrawer) {
    return (
      <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* Stepper container */}
      <div className="px-4 py-1.5 bg-white border-b border-slate-100 shadow-sm relative z-10 shrink-0 flex items-center justify-between gap-4">
        <AssetStepper
          currentStepId={currentStep?.id ?? 1}
          steps={steps}
        />
        <button
          onClick={handleBackToDashboard}
          className="px-4 py-1.5 bg-white hover:bg-red-50 active:bg-red-100 border border-red-600 rounded-lg text-[10px] font-bold text-red-600 uppercase transition-colors shrink-0 shadow-lg shadow-red-100/80"
          title={t("wizard.closeWizard")}
        >
          {t("wizard.close")}
        </button>
      </div>

      {/* Main wizard step content */}
      <div className="flex-1 pt-3 px-3 pb-1.5 bg-slate-50/30 overflow-y-auto custom-scrollbar">
        {children}
      </div>

      {/* Full-Width Footer container */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 shrink-0">
        <AssetFormFooter />
      </div>
    </div>
  );
}