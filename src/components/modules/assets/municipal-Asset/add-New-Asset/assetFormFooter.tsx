"use client";

import { CheckCircle2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getCurrentAssetStep,
  getNextAssetStep,
  getPreviousAssetStep,
  getFilteredSteps,
} from "./assetFormSteps";
import { useAssetForm } from "./AssetFormContext";
import { submitAssetForm, activateAssetAction } from "@/app/[locale]/asset/municipal-Asset/add-New-Asset/actions";
import AssetSuccessModal from "./AssetSuccessModal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { uploadDocumentAction, uploadBulkDocumentsAction, fetchDocumentDefinitionsAction } from "@/app/[locale]/asset/municipal-Asset/add-New-Asset/actions";
import { validateBuildingBasicInfo } from "@/hooks/asset-hooks/building-basic-info/useBuildingBasicInfoFormValidation";
import { validateLandBasicInfo } from "@/utils/asset-utils/basic-info/basic-info-validation-schemas";
import { useConfirm } from "@/components/common/ConfirmProvider";

function isDeepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }
  
  // Filter out undefined keys so that { a: 1, b: undefined } equals { a: 1 }
  const keys1 = Object.keys(obj1).filter(k => obj1[k] !== undefined);
  const keys2 = Object.keys(obj2).filter(k => obj2[k] !== undefined);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isDeepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}

function withLocale(pathname: string, targetPath: string) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  return `/${locale}${targetPath}`;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function AssetFormFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    formData,
    updateFormData,
    setErrors,
    setSubmittedOnce,
    lastSavedFormData,
    setLastSavedFormData,
    onSubmitHook,
    stagedFiles,
    setStagedFiles,
    basicInfoFiles,
    setBasicInfoFiles
  } = useAssetForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<{ assetName: string; assetCode: string } | null>(null);
  const { confirm } = useConfirm();

  useEffect(() => {
    if (formData && !lastSavedFormData && setLastSavedFormData) {
      setLastSavedFormData(JSON.parse(JSON.stringify(formData)));
    }
  }, [formData, lastSavedFormData, setLastSavedFormData]);

  const currentStep = getCurrentAssetStep(pathname, formData.category, formData.assetType, formData.parentBuildingId);
  const previousStep = getPreviousAssetStep(pathname, formData.category, formData.assetType, formData.parentBuildingId);
  const nextStep = getNextAssetStep(pathname, formData.category, formData.assetType, formData.parentBuildingId);

  const queryString = searchParams.toString();
  const appendQuery = (url: string) => (queryString ? `${url}?${queryString}` : url);

  const filteredSteps = getFilteredSteps(formData.category, formData.assetType, formData.parentBuildingId);
  const totalSteps = filteredSteps.length;
  const currentStepId = currentStep?.id ?? 1;
  const isFirstStep = !previousStep;
  const isLastStep = !nextStep;

  const handlePrevious = () => {
    if (!previousStep || isSubmitting) return;
    router.push(appendQuery(withLocale(pathname, previousStep.path)));
  };

  // ─── Final Submit: activate asset via PUT /AssetMaster/{id}/activate ────────
  const handleFinalSubmit = async () => {
    const assetId = Number(formData.id || formData.assetId);
    if (!assetId || assetId <= 0) {
      toast.error("Asset ID not found. Please complete all previous steps first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await activateAssetAction(assetId);
      if (result.success) {
        // Sequentially upload staged documents in context now that the asset is active
        const filesToUpload = stagedFiles ? Object.entries(stagedFiles) : [];
        if (filesToUpload.length > 0) {
          const loadingToast = toast.loading("Uploading staged compliance documents...");
          let uploadFailed = false;

          for (const [defId, item] of filesToUpload) {
            let userId = 1;
            try {
              const match = document.cookie.match(/(?:^|; )user_id=([^;]*)/);
              if (match) {
                userId = Number(decodeURIComponent(match[1])) || 1;
              }
            } catch (e) {
              // ignore
            }

            const formDataPayload = new FormData();
            formDataPayload.append("File", item.file);
            formDataPayload.append("AssetId", assetId.toString());
            formDataPayload.append("ModuleId", "1004");
            formDataPayload.append("DocumentDefinitionId", defId.toString());
            formDataPayload.append("DocumentTitle", item.definition.documentName);
            formDataPayload.append("DocumentType", item.definition.documentCode);
            formDataPayload.append("UploadedByUserId", userId.toString());

            const uploadRes = await uploadDocumentAction(formDataPayload);
            if (!uploadRes.success) {
              uploadFailed = true;
              console.error(`Failed to upload ${item.definition.documentName}:`, uploadRes.error || uploadRes.message);
              toast.error(`Failed to upload ${item.definition.documentName}`);
            }
          }

          toast.dismiss(loadingToast);
          if (uploadFailed) {
            toast.warning("Asset activated, but some documents failed to upload. You can re-upload them in Details.");
          } else {
            toast.success("All compliance documents uploaded successfully!");
            if (setStagedFiles) setStagedFiles({});
          }
        }

        // Show success modal with asset details
        setSuccessModal({
          assetName: formData.assetName || "",
          assetCode: formData.assetCode || "",
        });
      } else {
        toast.error(`Final submission failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Final submit error:", error);
      toast.error("An unexpected error occurred during final submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    setSuccessModal(null);
    const segments = pathname.split("/").filter(Boolean);
    const locale = segments[0] || "en";
    router.push(`/${locale}/asset/municipal-Asset`);
  };

  // ─── Save & Next for intermediate steps ────────────────────────────────────
  const handleNext = async (confirmedOverride?: boolean) => {
    // If this is the last step (Valuation), trigger Final Submit
    if (isLastStep) {
      await handleFinalSubmit();
      return;
    }

    // Run custom step submit hook if registered (e.g. legal compliance, documents-like steps)
    if (onSubmitHook) {
      setIsSubmitting(true);
      try {
        const success = await onSubmitHook();
        if (!success) {
          return; // Stop and keep user on the same page to fix errors
        }
      } catch (error) {
        console.error("Step submit hook error:", error);
        toast.error("Failed to complete step actions.");
        return;
      } finally {
        setIsSubmitting(false);
      }

      // Hook succeeded → navigate to next step
      if (nextStep) {
        const sp = new URLSearchParams(searchParams.toString());
        if (formData.id) {
          sp.set("id", String(formData.id));
          sp.set("assetId", String(formData.id));
        }
        if (formData.assetCode) {
          sp.set("assetCode", String(formData.assetCode));
        }
        router.push(withLocale(pathname, nextStep.path) + "?" + sp.toString());
      }
      return;
    }

    // Validate Building or Land Basic Info step before proceeding
    const isBuilding = formData.category === "Building Assets" || formData.category === "BUILDING";
    const isLand = formData.category === "Land Assets" || formData.category === "LAND";

    if (currentStep?.key === "basic-info" && (isBuilding || isLand)) {
      setSubmittedOnce?.(true);
      const validationErrors = validateBuildingBasicInfo(formData as any);
      setErrors?.(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        toast.error("Please fill in all required fields correctly.");
        return;
      }
    }

    const stepLabel = currentStep?.label || "Step Info";

    if (!confirmedOverride) {
      if (lastSavedFormData && isDeepEqual(formData, lastSavedFormData)) {
        toast.info("No changes detected. Proceeding to next step.");
        if (nextStep) {
          const sp = new URLSearchParams(searchParams.toString());
          if (formData.id) {
            sp.set("id", String(formData.id));
            sp.set("assetId", String(formData.id));
          }
          if (formData.assetCode) {
            sp.set("assetCode", String(formData.assetCode));
          }
          router.push(withLocale(pathname, nextStep.path) + "?" + sp.toString());
        }
        return;
      }
      
      // Proceed directly to save without confirmation modal
    }

    // Unify save and next for all intermediate steps
    setIsSubmitting(true);
    try {
      const result = await submitAssetForm(formData);
      if (result.success) {
        const assetId = (result as any).assetId || formData.id;
        const assetCode = (result as any).assetCode || (result.data as any)?.assetCode || (result.data as any)?.assetNo || formData.assetCode;

        const updates: any = {};
        if (assetId) {
          updates.id = assetId;
          updates.assetId = assetId;
        }
        if (assetCode) updates.assetCode = assetCode;

        if (Object.keys(updates).length > 0) {
          updateFormData(updates);
        }

        setLastSavedFormData?.(JSON.parse(JSON.stringify({ ...formData, ...updates })));

        const sp = new URLSearchParams(searchParams.toString());
        if (assetId) {
          sp.set("id", String(assetId));
          sp.set("assetId", String(assetId));
        }
        if (assetCode) {
          sp.set("assetCode", String(assetCode));
        }

        // Upload basic info files if they exist and we just saved basic info
        if (currentStep?.key === "basic-info" && basicInfoFiles && (basicInfoFiles.frontPhoto || basicInfoFiles.buildingPlan)) {
          let userId = 1;
          try {
            const match = document.cookie.match(/(?:^|; )user_id=([^;]*)/);
            if (match) {
              userId = Number(decodeURIComponent(match[1])) || 1;
            }
          } catch (e) {
            // ignore
          }

          const formDataPayload = new FormData();
          formDataPayload.append("AssetId", String(assetId || 0));
          formDataPayload.append("ModuleId", "1004");
          formDataPayload.append("UploadedByUserId", userId.toString());
          formDataPayload.append("IsAdHoc", "true");

          // Attempt to fetch correct document definitions for this category and type
          let frontPhotoDefId = 0;
          let planDefId = 0;
          try {
            const defRes = await fetchDocumentDefinitionsAction(formData.categoryId, formData.typeId || 0);
            if (defRes.success && Array.isArray(defRes.data)) {
              const frontDef = defRes.data.find(d => d.documentCode?.toLowerCase().includes("front") || d.documentName?.toLowerCase().includes("front"));
              if (frontDef) frontPhotoDefId = frontDef.id;

              const planDef = defRes.data.find(d => d.documentCode?.toLowerCase().includes("plan") || d.documentName?.toLowerCase().includes("plan"));
              if (planDef) planDefId = planDef.id;
            }
          } catch(e) {
            console.error("Failed to fetch definitions for basic info upload", e);
          }

          const metadata = [];

          if (basicInfoFiles.frontPhoto) {
            const uniqueName = `front_${basicInfoFiles.frontPhoto.name}`;
            const renamedFile = new File([basicInfoFiles.frontPhoto], uniqueName, { type: basicInfoFiles.frontPhoto.type });
            
            formDataPayload.append("Files", renamedFile);
            const metaItem: any = {
              fileName: uniqueName,
              documentType: "front_photo",
              documentTitle: "Asset Image",
            };
            if (frontPhotoDefId > 0) metaItem.documentDefinitionId = frontPhotoDefId;
            
            metadata.push(metaItem);
          }

          if (basicInfoFiles.buildingPlan) {
            const uniqueName = `plan_${basicInfoFiles.buildingPlan.name}`;
            const renamedFile = new File([basicInfoFiles.buildingPlan], uniqueName, { type: basicInfoFiles.buildingPlan.type });

            formDataPayload.append("Files", renamedFile);
            const metaItem: any = {
              fileName: uniqueName,
              documentType: "building_plan",
              documentTitle: "Asset Photo Plan",
            };
            if (planDefId > 0) metaItem.documentDefinitionId = planDefId;

            metadata.push(metaItem);
          }

          formDataPayload.append("FileMetadataJson", JSON.stringify(metadata));

          const uploadRes = await uploadBulkDocumentsAction(formDataPayload);

          if (!uploadRes.success || (uploadRes.data && uploadRes.data.failureCount > 0)) {
            const detailedError = uploadRes.data?.failedUploads?.[0]?.errorMessage || uploadRes.error || "Unknown bulk upload error";
            console.error("Failed to bulk upload photos:", uploadRes.data?.failedUploads || uploadRes.error);
            toast.error(`Photo upload failed: ${detailedError}`);
          } else {
            if (setBasicInfoFiles) setBasicInfoFiles({});
          }
        }

        toast.success(`${stepLabel} saved successfully!`);

        if (!nextStep) return;
        router.push(withLocale(pathname, nextStep.path) + "?" + sp.toString());
        return;
      } else {
        toast.error(`Failed to save ${stepLabel.toLowerCase()}: ${result.error}`);
        return;
      }
    } catch (error) {
      console.error(`Error saving ${stepLabel.toLowerCase()}:`, error);
      toast.error(`An unexpected error occurred while saving ${stepLabel.toLowerCase()}.`);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (onSubmitHook) {
      setIsSubmitting(true);
      try {
        const success = await onSubmitHook();
        if (success) {
          toast.success("Draft saved successfully!");
        }
      } catch (error) {
        console.error("Save draft hook error:", error);
        toast.error("Failed to save draft.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Validate Building or Land Basic Info step before saving draft
    const isBuilding = formData.category === "Building Assets" || formData.category === "BUILDING";
    const isLand = formData.category === "Land Assets" || formData.category === "LAND";
    const isBasicInfoStep = currentStep?.key === "basic-info";

    if (isBasicInfoStep && (isBuilding || isLand)) {
      setSubmittedOnce?.(true);
      const validationErrors = isBuilding
        ? validateBuildingBasicInfo(formData as any)
        : validateLandBasicInfo(formData);
      setErrors?.(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        toast.error("Please fill in all required fields correctly before saving.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await submitAssetForm(formData);

      if (result.success) {
        const assetId = (result as any).assetId || formData.id;
        const assetCode =
          (result as any).assetCode ||
          (result.data as any)?.assetCode ||
          (result.data as any)?.assetNo ||
          formData.assetCode;

        // Persist returned IDs into local form state
        const updates: Record<string, any> = {};
        if (assetId) {
          updates.id = assetId;
          updates.assetId = assetId;
        }
        if (assetCode) updates.assetCode = assetCode;

        if (Object.keys(updates).length > 0) {
          updateFormData(updates);
        }

        setLastSavedFormData?.(JSON.parse(JSON.stringify({ ...formData, ...updates })));

        // Sync IDs into URL search params so they survive page refreshes
        const sp = new URLSearchParams(searchParams.toString());
        if (assetId) {
          sp.set("id", String(assetId));
          sp.set("assetId", String(assetId));
        }
        if (assetCode) {
          sp.set("assetCode", String(assetCode));
        }

        router.replace(pathname + "?" + sp.toString());

        toast.success(
          isBasicInfoStep
            ? formData.id
              ? "Basic info updated successfully!"
              : "Basic info saved successfully!"
            : "Asset draft saved successfully!"
        );
      } else {
        toast.error(
          isBasicInfoStep
            ? `Failed to save basic info: ${result.error}`
            : `Save failed: ${result.error}`
        );
      }
    } catch (e) {
      console.error("Error saving asset:", e);
      toast.error("An unexpected error occurred while saving asset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {successModal && (
        <AssetSuccessModal
          assetName={successModal.assetName}
          assetCode={successModal.assetCode}
          onGoToDashboard={handleGoToDashboard}
        />
      )}

      <div className="flex items-center justify-between bg-white w-full">
        {/* Left side empty placeholder to maintain flex spacing */}
        <div />

        {/* Right-Aligned Navigation & Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isFirstStep || isSubmitting}
            onClick={handlePrevious}
            className={`rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${isFirstStep || isSubmitting
              ? "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-400"
              : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-[0.98]"
              }`}
          >
            &lt; Previous
          </button>

          <div className="rounded-xl border border-slate-200 bg-slate-100 px-2 py-2.5 text-xs font-black text-slate-700 uppercase tracking-wider shadow-inner">
            Step {currentStepId} of {totalSteps}
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleNext()}
            className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all min-w-[140px] justify-center cursor-pointer shadow-sm hover:shadow active:scale-[0.98] ${isSubmitting
              ? "cursor-not-allowed bg-emerald-400 text-white"
              : isLastStep
                ? "bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-300/40"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isLastStep ? "Submitting..." : "Saving..."}</span>
              </>
            ) : (
              <>
                {isLastStep ? "✓ Final Submit" : "Save & Next"}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
