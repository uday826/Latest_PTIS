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

  const isEditMode = searchParams.get('mode') === 'edit';
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
    <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* Top Wizard Header — styled to match the main site header color */}
      <div 
        className="text-white px-4 py-2 flex items-center justify-between border-b border-white/10 shrink-0"
        style={{ backgroundColor: '#1e293b' }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/15 border border-white/20 p-2 rounded-lg flex items-center justify-center shadow-inner">
            {isEditMode
              ? <PencilLine className="size-5 text-yellow-300" />
              : <Home className="size-5 text-white" />
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
            <p className="text-[10px] text-yellow-300 font-extrabold uppercase tracking-wider mt-1.5">
              Step {currentStep?.id ?? 1} of {steps.length} | {currentStep?.label ?? 'Basic Info'}
              {isEditMode && assetCode && (
                <span className="ml-2 text-white/70">• {assetCode}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToDashboard}
            className="px-3 py-1.5 border border-slate-500 hover:border-slate-300 hover:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-300 uppercase transition-colors"
            title="Close Wizard"
          >
            Close
          </button>
        </div>
      </div>

      {/* Stepper container */}
      <div className="px-4 py-1.5 bg-white border-b border-slate-100 shadow-sm relative z-10 shrink-0">
        <AssetStepper
          currentStepId={currentStep?.id ?? 1}
          steps={steps}
        />
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