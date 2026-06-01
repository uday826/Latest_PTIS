"use client";

import { useBuildingBasicInfoForm } from "@/hooks/asset-hooks/building-basic-info";

// New validated components for building/land assets
import { BuildingPropertyDetailsSection } from "./BuildingPropertyDetailsSection";
import { BuildingOwnershipDetailsSection } from "./BuildingOwnershipDetailsSection";

import { DynamicAttributes } from "./DynamicAttributes";

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

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
  );
}