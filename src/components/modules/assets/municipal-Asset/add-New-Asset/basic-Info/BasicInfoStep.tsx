"use client";

import { useBuildingBasicInfoForm } from "@/hooks/asset-hooks/building-basic-info";

// New validated components for building/land assets
import { BuildingOwnershipDetailsSection } from "./BuildingOwnershipDetailsSection";
import { BuildingPropertyDetailsSection } from "./BuildingPropertyDetailsSection";
import { MovableParentAssetSection } from "./MovableParentAssetSection";

import { fetchDocumentFileAction, fetchUploadedDocumentsAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions";
import { Card } from "@/components/common";
import { UploadCloud } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAssetForm } from "../AssetFormContext";
import { DynamicAttributes } from "./DynamicAttributes";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useTranslations } from "next-intl";

import type { Department } from "@/lib/api/asset/department.service";
import type { Mouja } from "@/lib/api/asset/mouja.service";
import type { Ward } from "@/lib/api/asset/ward.service";
import type { Zone } from "@/lib/api/asset/zone.service";
import type { OwnershipType } from "@/lib/api/asset/ownership-type.service";
import type { BasicInfoPageProps } from "@/types/asset-types/basic-info/basicInfo.types";

export default function BasicInfoPage({ wards = [], zones = [], departments = [], moujas = [], prefetchedFields = [], ownershipTypes = [], useTypes = [] }: BasicInfoPageProps) {
  return (
    <BuildingBasicInfoContent
      wards={wards}
      zones={zones}
      departments={departments}
      moujas={moujas}
      ownershipTypes={ownershipTypes}
      prefetchedFields={prefetchedFields}
      useTypes={useTypes}
    />
  );
}

/**
 * Isolated content sub-component for Building & Land category
 * Uses the advanced, strictly typed hooks, sections, and advanced validations.
 */
function BuildingBasicInfoContent({
  wards = [],
  zones = [],
  departments = [],
  moujas = [],
  ownershipTypes = [],
  prefetchedFields = [],
  useTypes = [],
}: {
  wards?: Ward[];
  zones?: Zone[];
  departments?: Department[];
  moujas?: Mouja[];
  ownershipTypes?: OwnershipType[];
  prefetchedFields?: any[];
  useTypes?: any[];
}) {
  const {
    formData,
    errors,
    showError,
    handleChange,
    handleAttributeChange,
    updateFormData,
  } = useBuildingBasicInfoForm();
  const { confirm } = useConfirm();
  const t = useTranslations("addAssetForm");

  const [dynamicSubzones, setDynamicSubzones] = useState<any[]>([]);
  const [isLoadingSubzones, setIsLoadingSubzones] = useState(false);

  const [dynamicSubTypes, setDynamicSubTypes] = useState<any[]>([]);
  const [isLoadingSubTypes, setIsLoadingSubTypes] = useState(false);

  // Load subzones reactively whenever mouja is set or changed in formData
  useEffect(() => {
    if (!formData.mouja) {
      setDynamicSubzones([]);
      return;
    }

    const loadSubzones = async () => {
      setIsLoadingSubzones(true);
      try {
        const { fetchSubzonesByMoujaAction } = await import("@/app/[locale]/assets/municipal-Asset/add-New-Asset/basic-Info/actions");
        const res = await fetchSubzonesByMoujaAction(formData.mouja);
        if (res.success && res.data) {
          setDynamicSubzones(res.data);
        } else {
          setDynamicSubzones([]);
        }
      } catch (err) {
        console.error("Failed to load subzones:", err);
        setDynamicSubzones([]);
      } finally {
        setIsLoadingSubzones(false);
      }
    };
    loadSubzones();
  }, [formData.mouja]);

  // Load subtypes of use reactively whenever typeOfUseId is set or changed in formData
  useEffect(() => {
    if (!formData.typeOfUseId) {
      setDynamicSubTypes([]);
      return;
    }

    const loadSubTypes = async () => {
      setIsLoadingSubTypes(true);
      try {
        const { fetchSubTypesByTypeAction } = await import("@/app/[locale]/assets/municipal-Asset/add-New-Asset/basic-Info/actions");
        const res = await fetchSubTypesByTypeAction(formData.typeOfUseId ? Number(formData.typeOfUseId) : 0);
        if (res.success && res.data) {
          setDynamicSubTypes(res.data);
        } else {
          setDynamicSubTypes([]);
        }
      } catch (err) {
        console.error("Failed to load sub use types:", err);
        setDynamicSubTypes([]);
      } finally {
        setIsLoadingSubTypes(false);
      }
    };
    loadSubTypes();
  }, [formData.typeOfUseId]);

  const handleMoujaChange = (_moujaId: string) => {
    // Clear subzone selection in the form state on manual change
    updateFormData({ subzone: "" });
  };


  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [buildingPlan, setBuildingPlan] = useState<string | null>(null);
  const [fileErrors, setFileErrors] = useState<{ frontPhoto?: string; buildingPlan?: string }>({});

  const frontPhotoRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);

  const { setBasicInfoFiles, basicInfoFiles, formData: globalFormData, setIsDataLoading } = useAssetForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>, documentType: string) => {
    const file = e.target.files?.[0];
    const key = documentType === "front_photo" ? "frontPhoto" : "buildingPlan";

    if (file) {
      // 1. File size validation (Max 5MB)
      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
        setFileErrors(prev => ({ ...prev, [key]: t("basicInfo.validation.fileSizeExceeds", { maxSize: maxSizeMB }) }));
        toast.error(t("basicInfo.validation.fileSizeExceeds", { maxSize: maxSizeMB }));
        e.target.value = "";
        return;
      }

      // 2. File extension validation
      const allowedExtensions = ['.bmp', '.doc', '.docx', '.gif', '.jpeg', '.jpg', '.pdf', '.png', '.ppt', '.pptx', '.tif', '.tiff', '.txt', '.webp', '.xls', '.xlsx'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        setFileErrors(prev => ({ ...prev, [key]: t("basicInfo.validation.invalidFileType", { extensions: allowedExtensions.join(', ') }) }));
        toast.error(t("basicInfo.validation.invalidFileType", { extensions: allowedExtensions.join(', ') }));
        e.target.value = "";
        return;
      }

      // 3. Duplicate file validation
      const otherFile = documentType === "front_photo" ? basicInfoFiles?.buildingPlan : basicInfoFiles?.frontPhoto;
      if (otherFile && otherFile.name === file.name && otherFile.size === file.size) {
        setFileErrors(prev => ({ ...prev, [key]: t("basicInfo.validation.duplicateFileOtherDoc") }));
        toast.error(t("basicInfo.validation.duplicateFileDetected"));
        e.target.value = "";
        return;
      }

      // Clear any existing errors for this field
      setFileErrors(prev => ({ ...prev, [key]: undefined }));

      const url = URL.createObjectURL(file);
      setter(url);

      if (setBasicInfoFiles) {
        setBasicInfoFiles((prev) => ({
          ...prev,
          [key]: file,
        }));
      }
    }
  };

  useEffect(() => {
    // 1. Show locally selected files immediately
    if (basicInfoFiles?.frontPhoto && !frontPhoto) {
      setFrontPhoto(URL.createObjectURL(basicInfoFiles.frontPhoto));
    }
    if (basicInfoFiles?.buildingPlan && !buildingPlan) {
      setBuildingPlan(URL.createObjectURL(basicInfoFiles.buildingPlan));
    }

    // 2. Fetch previously uploaded images from backend if local files are missing
    const loadUploadedDocs = async () => {
      const assetId = globalFormData.id || globalFormData.assetId;
      if (!assetId || (frontPhoto && buildingPlan)) return;

      if (setIsDataLoading) setIsDataLoading(true);
      try {
        const res = await fetchUploadedDocumentsAction(assetId, true, true);
        if (res.success && res.data) {
          const docs: any[] = res.data;


          // Front Photo
          if (!frontPhoto && !basicInfoFiles?.frontPhoto) {
            const frontDoc = docs.find(d =>
              d.documentType === "front_photo" ||
              d.documentTitle?.toLowerCase().includes("front") ||
              d.fileName?.toLowerCase().includes("front") ||
              d.documentCode?.toLowerCase().includes("front") ||
              d.documentName?.toLowerCase().includes("front")
            );

            if (frontDoc) {
              const fileRes = await fetchDocumentFileAction(frontDoc.id);
              if (fileRes.success && fileRes.data) {
                setFrontPhoto(`data:${fileRes.mimeType};base64,${fileRes.data}`);
              } else {

              }
            }
          }

          // Building Plan
          if (!buildingPlan && !basicInfoFiles?.buildingPlan) {
            const planDoc = docs.find(d =>
              d.documentType === "building_plan" ||
              d.documentTitle?.toLowerCase().includes("plan") ||
              d.fileName?.toLowerCase().includes("plan") ||
              d.documentCode?.toLowerCase().includes("plan") ||
              d.documentName?.toLowerCase().includes("plan")
            );

            if (planDoc) {
              const fileRes = await fetchDocumentFileAction(planDoc.id);
              if (fileRes.success && fileRes.data) {
                setBuildingPlan(`data:${fileRes.mimeType};base64,${fileRes.data}`);
              } else {

              }
            }
          }
        }
      } catch (err) {

      } finally {
        if (setIsDataLoading) setIsDataLoading(false);
      }
    };

    // Only load if we have an assetId and we are missing one of the photos
    if (globalFormData.id || globalFormData.assetId) {
      loadUploadedDocs();
    }
  }, [globalFormData.id, globalFormData.assetId, basicInfoFiles]);

  const showFormDetails = !formData.isMovableCategory || !!formData.parentBuildingId;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 [&_label]:!font-bold [&_span[id$=-label]]:!font-bold [&_span.text-gray-700]:!font-bold">

      {/* Left Column (Forms) */}
      <div className="lg:col-span-4 space-y-3">
        <div className={showFormDetails ? "lg:col-span-3 space-y-4" : "lg:col-span-4 space-y-4"}>
          {formData.isMovableCategory && (
            <MovableParentAssetSection
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {showFormDetails && (
            <>
              {/* Section A — Property Number Details */}
              <BuildingPropertyDetailsSection
                formData={formData}
                errors={errors}
                showError={showError}
                handleChange={handleChange}
                wards={wards}
                zones={zones}
                moujas={moujas}
                subzones={dynamicSubzones}
                isLoadingSubzones={isLoadingSubzones}
                onMoujaChange={handleMoujaChange}
                useTypes={useTypes}
                subUseTypes={dynamicSubTypes}
                isLoadingSubTypes={isLoadingSubTypes}
              />

              {/* Section B — Ownership Details & Address Details */}
              <BuildingOwnershipDetailsSection
                formData={formData}
                errors={errors}
                showError={showError}
                handleChange={handleChange}
                departments={departments}
                ownershipTypes={ownershipTypes}
                updateFormData={updateFormData}
              />


              {/* Section C — Dynamic Attributes */}
              <DynamicAttributes
                formData={formData}
                onAttributeChange={handleAttributeChange}
                useApi={true}
                prefetchedFields={prefetchedFields}
              />
            </>
          )}
        </div>
      </div>

      {/* Right Column (Media) */}
      <div className="lg:col-span-1 space-y-3">

        {/* Media Card (Asset Image & Asset Photo Plan) */}
        <Card variant="bordered" className="bg-white border-slate-200/80 rounded-2xl shadow-sm p-3 space-y-3.5" padding="none">
          {/* Asset Image */}
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">{t("basicInfo.media.assetImage")}</span>
            <div
              onClick={() => !frontPhoto && frontPhotoRef.current?.click()}
              className={`relative h-64 rounded-xl border flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group ${frontPhoto ? 'border-slate-200' : 'border-slate-200 bg-[#e2ebf5]/30 hover:bg-[#e2ebf5]/60 hover:border-slate-300 shadow-sm'}`}
            >
              {frontPhoto ? (
                <>
                  <img src={frontPhoto} alt={t("basicInfo.media.assetImage")} className="w-full h-full object-cover" />
                  {/* Top right action buttons (always visible when image exists) */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        frontPhotoRef.current?.click();
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-600 rounded-full shadow-md transition-colors flex items-center justify-center text-[9px] font-black uppercase tracking-wider"
                      title={t("basicInfo.media.replace")}
                    >
                      {t("basicInfo.media.replace")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirm({
                          variant: "delete",
                          title: t("basicInfo.validation.confirmDeleteImageTitle"),
                          description: t("basicInfo.validation.confirmDeleteImageDesc"),
                          onConfirm: () => {
                            setFrontPhoto(null);
                            if (setBasicInfoFiles) {
                              setBasicInfoFiles(prev => ({ ...prev, frontPhoto: undefined }));
                            }
                            if (frontPhotoRef.current) frontPhotoRef.current.value = "";
                          }
                        });
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 rounded-full shadow-md transition-colors flex items-center justify-center text-[9px] font-black uppercase tracking-wider"
                      title={t("basicInfo.media.delete")}
                    >
                      {t("basicInfo.media.delete")}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 select-none p-4">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-full text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                    <UploadCloud className="size-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{t("basicInfo.media.uploadAssetImage")}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-1 text-center">{t("basicInfo.media.clickBrowse")}</span>
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx"
            className="hidden"
            ref={frontPhotoRef}
            onChange={(e) => handleFileChange(e, setFrontPhoto, "front_photo")}
          />
          {fileErrors.frontPhoto && (
            <p className="mt-1 text-[10px] font-medium text-red-500 leading-tight px-1">
              {fileErrors.frontPhoto}
            </p>
          )}

          {/* Asset Photo Plan */}
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">{t("basicInfo.media.assetPhotoPlan")}</span>
            <div
              onClick={() => !buildingPlan && planRef.current?.click()}
              className={`relative h-64 rounded-xl border flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group ${buildingPlan ? 'border-slate-200' : 'border-slate-200 bg-[#e2ebf5]/30 hover:bg-[#e2ebf5]/60 hover:border-slate-300 shadow-sm'}`}
            >
              {buildingPlan ? (
                <>
                  <img src={buildingPlan} alt={t("basicInfo.media.assetPhotoPlan")} className="w-full h-full object-cover" />
                  {/* Top right action buttons (always visible when image exists) */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        planRef.current?.click();
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-600 rounded-full shadow-md transition-colors flex items-center justify-center text-[9px] font-black uppercase tracking-wider"
                      title={t("basicInfo.media.replace")}
                    >
                      {t("basicInfo.media.replace")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirm({
                          variant: "delete",
                          title: t("basicInfo.validation.confirmDeletePlanTitle"),
                          description: t("basicInfo.validation.confirmDeletePlanDesc"),
                          onConfirm: () => {
                            setBuildingPlan(null);
                            if (setBasicInfoFiles) {
                              setBasicInfoFiles(prev => ({ ...prev, buildingPlan: undefined }));
                            }
                            if (planRef.current) planRef.current.value = "";
                          }
                        });
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 rounded-full shadow-md transition-colors flex items-center justify-center text-[9px] font-black uppercase tracking-wider"
                      title={t("basicInfo.media.delete")}
                    >
                      {t("basicInfo.media.delete")}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 select-none p-4">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-full text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                    <UploadCloud className="size-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{t("basicInfo.media.uploadAssetPhotoPlan")}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-1 text-center">{t("basicInfo.media.clickBrowse")}</span>
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx"
            className="hidden"
            ref={planRef}
            onChange={(e) => handleFileChange(e, setBuildingPlan, "building_plan")}
          />
          {fileErrors.buildingPlan && (
            <p className="mt-1 text-[10px] font-medium text-red-500 leading-tight px-1">
              {fileErrors.buildingPlan}
            </p>
          )}
        </Card>
      </div>

    </div>
  );
}