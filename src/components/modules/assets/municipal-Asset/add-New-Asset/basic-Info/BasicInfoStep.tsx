"use client";

import { useBuildingBasicInfoForm } from "@/hooks/asset-hooks/building-basic-info";

// New validated components for building/land assets
import { BuildingPropertyDetailsSection } from "./BuildingPropertyDetailsSection";
import { BuildingOwnershipDetailsSection } from "./BuildingOwnershipDetailsSection";

import { DynamicAttributes } from "./DynamicAttributes";
import { useAssetForm } from "../AssetFormContext";
import React, { useState, useRef, useEffect } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { toast } from "sonner";
import { fetchUploadedDocumentsAction, fetchDocumentFileAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions";

import type { Ward } from "@/lib/api/asset/ward.service";
import type { Zone } from "@/lib/api/asset/zone.service";
import type { Department } from "@/lib/api/asset/department.service";
import type { Mouja } from "@/lib/api/asset/mouja.service";
import type { BasicInfoPageProps } from "@/types/asset-types/basic-info/basicInfo.types";

export default function BasicInfoPage({ wards = [], zones = [], departments = [], moujas = [], prefetchedFields = [], subzones = [] }: BasicInfoPageProps) {
  return (
    <BuildingBasicInfoContent
      wards={wards}
      zones={zones}
      departments={departments}
      moujas={moujas}
      prefetchedFields={prefetchedFields}
      subzones={subzones}
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
  prefetchedFields = [],
  subzones = []
}: {
  wards?: Ward[];
  zones?: Zone[];
  departments?: Department[];
  moujas?: Mouja[];
  prefetchedFields?: any[];
  subzones?: any[];
}) {
  const {
    formData,
    errors,
    showError,
    handleChange,
    handleAttributeChange,
    updateFormData,
  } = useBuildingBasicInfoForm();

  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [buildingPlan, setBuildingPlan] = useState<string | null>(null);
  const [fileErrors, setFileErrors] = useState<{ frontPhoto?: string; buildingPlan?: string }>({});

  const frontPhotoRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);

  const { setBasicInfoFiles, basicInfoFiles, formData: globalFormData } = useAssetForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>, documentType: string) => {
    const file = e.target.files?.[0];
    const key = documentType === "front_photo" ? "frontPhoto" : "buildingPlan";
    
    if (file) {
      // 1. File size validation (Max 5MB)
      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
        setFileErrors(prev => ({ ...prev, [key]: `File size exceeds ${maxSizeMB}MB limit.` }));
        toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
        e.target.value = "";
        return;
      }

      // 2. Duplicate file validation
      const otherFile = documentType === "front_photo" ? basicInfoFiles?.buildingPlan : basicInfoFiles?.frontPhoto;
      if (otherFile && otherFile.name === file.name && otherFile.size === file.size) {
        setFileErrors(prev => ({ ...prev, [key]: "You have already selected this exact file for the other document. Please select a different file." }));
        toast.error("Duplicate file detected.");
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
      
      try {
        const res = await fetchUploadedDocumentsAction(assetId, true, true);
        if (res.success && res.data) {
          const docs: any[] = res.data;
          console.log("Fetched docs for basic info images:", docs);
          
          // Front Photo
          if (!frontPhoto && !basicInfoFiles?.frontPhoto) {
            const frontDoc = docs.find(d => 
              d.documentType === "front_photo" || 
              d.documentTitle?.toLowerCase().includes("front") ||
              d.fileName?.toLowerCase().includes("front") ||
              d.documentCode?.toLowerCase().includes("front") ||
              d.documentName?.toLowerCase().includes("front")
            );
            console.log("Found frontDoc:", frontDoc);
            if (frontDoc) {
              const fileRes = await fetchDocumentFileAction(frontDoc.id);
              if (fileRes.success && fileRes.data) {
                setFrontPhoto(`data:${fileRes.mimeType};base64,${fileRes.data}`);
              } else {
                console.log("Failed to fetch front photo binary", fileRes.error);
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
            console.log("Found planDoc:", planDoc);
            if (planDoc) {
              const fileRes = await fetchDocumentFileAction(planDoc.id);
              if (fileRes.success && fileRes.data) {
                setBuildingPlan(`data:${fileRes.mimeType};base64,${fileRes.data}`);
              } else {
                console.log("Failed to fetch plan photo binary", fileRes.error);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load basic info images", err);
      }
    };
    
    // Only load if we have an assetId and we are missing one of the photos
    if (globalFormData.id || globalFormData.assetId) {
      loadUploadedDocs();
    }
  }, [globalFormData.id, globalFormData.assetId, basicInfoFiles]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Column (Forms) */}
      <div className="lg:col-span-3 space-y-4">
        {/* Section A — Property Number Details */}
        <BuildingPropertyDetailsSection
          formData={formData}
          errors={errors}
          showError={showError}
          handleChange={handleChange}
          wards={wards}
          zones={zones}
          moujas={moujas}
          subzones={subzones}
        />

        {/* Section B — Ownership Details & Address Details */}
        <BuildingOwnershipDetailsSection
          formData={formData}
          errors={errors}
          showError={showError}
          handleChange={handleChange}
          departments={departments}
          updateFormData={updateFormData}
        />

        {/* Section C — Dynamic Attributes */}
        <DynamicAttributes
          formData={formData}
          onAttributeChange={handleAttributeChange}
          useApi={true}
          prefetchedFields={prefetchedFields}
        />
      </div>

      {/* Right Column (Media & Map) */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Asset Image Card */}
        <Card variant="bordered" className="bg-blue-50/50 border-blue-100 rounded-2xl shadow-sm">
          <CardHeader className="py-2.5 px-3 border-b border-blue-100/60 bg-blue-50 rounded-t-2xl flex flex-row items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ImagePlus className="size-3.5 text-blue-600" />
              <CardTitle className="text-[10px] font-black text-blue-900 uppercase tracking-wider">Asset Image</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-2.5">
            <div 
              className={`relative h-24 rounded-xl border border-dashed ${frontPhoto ? 'border-blue-300' : 'border-blue-200 bg-white hover:bg-blue-50'} flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden`}
              onClick={() => !frontPhoto && frontPhotoRef.current?.click()}
            >
              {frontPhoto ? (
                <>
                  <img src={frontPhoto} alt="Front Photo" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFrontPhoto(null); }}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="size-2.5" />
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud className="size-5 text-blue-300 mb-0.5" />
                  <span className="text-[9px] font-bold text-blue-600">Click to upload</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={frontPhotoRef} 
              onChange={(e) => handleFileChange(e, setFrontPhoto, "front_photo")} 
            />
            <button 
              type="button" 
              onClick={() => frontPhotoRef.current?.click()}
              className="mt-1.5 w-full h-6 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-1 text-[9px] font-bold transition-colors"
            >
              <ImagePlus className="size-3" /> {frontPhoto ? 'Change Photo' : 'Add Photo'}
            </button>
            {fileErrors.frontPhoto && (
              <p className="mt-1.5 text-[10px] font-medium text-red-500 leading-tight">
                {fileErrors.frontPhoto}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Asset Photo Plan Card */}
        <Card variant="bordered" className="bg-amber-50/50 border-amber-100 rounded-2xl shadow-sm">
          <CardHeader className="py-2.5 px-3 border-b border-amber-100/60 bg-amber-50 rounded-t-2xl flex flex-row items-center justify-between">
            <div className="flex items-center gap-1.5">
              <UploadCloud className="size-3.5 text-amber-600" />
              <CardTitle className="text-[10px] font-black text-amber-900 uppercase tracking-wider">Asset Photo Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-2.5">
            <div 
              className={`relative h-24 rounded-xl border border-dashed ${buildingPlan ? 'border-amber-300' : 'border-amber-200 bg-white hover:bg-amber-50'} flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden`}
              onClick={() => !buildingPlan && planRef.current?.click()}
            >
              {buildingPlan ? (
                <>
                  <img src={buildingPlan} alt="Building Plan" className="w-full h-full object-cover opacity-80" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setBuildingPlan(null); }}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="size-2.5" />
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud className="size-5 text-amber-300 mb-0.5" />
                  <span className="text-[9px] font-bold text-amber-600">Click to upload</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*,.pdf" 
              className="hidden" 
              ref={planRef} 
              onChange={(e) => handleFileChange(e, setBuildingPlan, "building_plan")} 
            />
            <button 
              type="button" 
              onClick={() => planRef.current?.click()}
              className="mt-2 w-full py-1.5 px-3 bg-white border border-amber-200 text-[10px] font-bold text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
            >
              {buildingPlan ? "Change Plan" : "Upload Plan"}
            </button>
            {fileErrors.buildingPlan && (
              <p className="mt-1.5 text-[10px] font-medium text-red-500 leading-tight">
                {fileErrors.buildingPlan}
              </p>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}