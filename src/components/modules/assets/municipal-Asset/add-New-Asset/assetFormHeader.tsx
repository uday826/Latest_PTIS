"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AssetStepper } from "@/components/modules/assets/municipal-Asset/add-New-Asset/assetStepper";
import { AssetFormFooter } from "@/components/modules/assets/municipal-Asset/add-New-Asset/assetFormFooter";
import { getFilteredSteps, getCurrentAssetStep, type CategoryFlags } from "@/components/modules/assets/municipal-Asset/add-New-Asset/assetFormSteps";
import { Home, PencilLine } from "lucide-react";

import { AssetFormProvider, useAssetForm } from "@/components/modules/assets/municipal-Asset/add-New-Asset/AssetFormContext";

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

  const isEditMode = searchParams.get('mode') === 'edit' || !!(searchParams.get('assetId') || searchParams.get('id'));
  const assetCode = searchParams.get('assetCode') || formData.assetCode || '';

  const categoryFlags: CategoryFlags | undefined =
    formData.hasFloorDetails !== undefined ? {
      isMovable:            formData.isMovableCategory,
      hasFloorDetails:      formData.hasFloorDetails,
      hasInventory:         formData.hasInventory,
      isInventoryMandatory: formData.isInventoryMandatory,
      hasLegalCompliance:   formData.hasLegalCompliance,
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

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Header — dark navy for new, amber-tinted for edit */}
      <div className={`${isEditMode ? 'bg-[#1a1200]' : 'bg-[#0f172a]'} text-white px-4 py-2 flex items-center justify-between border-b ${isEditMode ? 'border-amber-900/40' : 'border-slate-800'} shrink-0`}>
        <div className="flex items-center gap-3">
          <div className={`${isEditMode ? 'bg-amber-900/40 border-amber-700/40' : 'bg-[#1e293b] border-slate-700/50'} p-2 rounded-lg border flex items-center justify-center shadow-inner`}>
            {isEditMode
              ? <PencilLine className="size-5 text-amber-400" />
              : <Home className="size-5 text-blue-400" />
            }
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white leading-none">
                {isEditMode ? 'Edit Municipal Asset' : 'Add New Municipal Asset'}
              </h1>
              {isEditMode && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400">
                  Edit Mode
                </span>
              )}
            </div>
            <p className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider mt-1.5">
              Step {currentStep?.id ?? 1} of {steps.length} | {currentStep?.label ?? 'Basic Info'}
              {isEditMode && assetCode && (
                <span className="ml-2 text-amber-400/70">• {assetCode}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToDashboard}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 rounded-lg border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm flex items-center justify-center"
            title="Close Wizard"
          >
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Stepper container */}
      <div className="px-4 py-1.5 bg-white border-b border-slate-100 shrink-0">
        <AssetStepper
          currentStepId={currentStep?.id ?? 1}
          steps={steps}
        />
      </div>

      {/* Main wizard step content */}
      <div className="flex-1 p-2 bg-slate-50/30 overflow-y-auto custom-scrollbar">
        {children}
      </div>

      {/* Full-Width Footer container */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 shrink-0">
        <AssetFormFooter />
      </div>
    </div>
  );
}