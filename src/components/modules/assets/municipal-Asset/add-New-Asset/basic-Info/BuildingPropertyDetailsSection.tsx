"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SearchSelect,
} from "@/components/common";
import type { BuildingPropertyDetailsSectionProps } from "@/types/asset-types/basic-info/buildBasicInfo.types";
import { Building } from "lucide-react";
import React from "react";

/**
 * Section A — Property Number Details
 *
 * Displays read-only Asset Category & Type badges, Zone/Ward dropdowns,
 * Property  No (required), and Survey No.
 * Validation errors are wired via showError / errors props.
 */
export function BuildingPropertyDetailsSection({
  formData,
  errors,
  showError,
  handleChange,
  wards = [],
  zones = [],
  moujas = [],
  subzones = [],
  isLoadingSubzones = false,
  onMoujaChange,
  useTypes = [],
  subUseTypes = [],
  isLoadingSubTypes = false,
}: BuildingPropertyDetailsSectionProps): React.JSX.Element {
  const isLand = formData.valuationType
    ? formData.valuationType === "LAND"
    : formData.category?.toLowerCase().includes("land");

  const isBuilding = formData.valuationType
    ? formData.valuationType === "BUILDING"
    : formData.category?.toLowerCase().includes("building") || (formData as any).hasFloorDetails === true;

  return (
    <Card
      variant="bordered"
      padding="sm"
      className="shadow-sm border-slate-200/80 bg-white rounded-2xl"
    >
      <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border border-[#A3CBFA] rounded-xl py-1 px-2.5 mb-2.5 shadow-sm">
        <div className="bg-[#1d4ed8] p-1 rounded-lg text-white shadow-sm flex items-center justify-center shrink-0">
          <Building className="size-3.5 text-white" />
        </div>
        <CardTitle className="text-xs font-bold text-[#1d4ed8] uppercase tracking-widest">
          Asset Details
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-start text-[11px] [&_label]:text-[11px] [&_label]:mb-1 [&_span[id$=-label]]:text-[11px] [&_input]:!px-2 [&_input]:!py-1 [&_input]:!h-7 [&_input]:!text-[11px] [&_input]:!rounded-md [&_button[role=combobox]]:!px-2 [&_button[role=combobox]]:!h-7 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px] [&_span.text-red-600]:text-[10px] [&_span.text-red-600]:mt-0.5">
        {/* Asset Category — read-only */}
        <div className="flex flex-col">
          <span className="mb-1 text-[11px] font-medium text-gray-700">
            Asset Category
          </span>
          <div className="h-7 px-2 bg-slate-100 border border-slate-200 rounded-md text-[11px] text-slate-700 font-bold flex items-center">
            {formData.category}
          </div>
        </div>

        {/* Asset Type — read-only */}
        <div className="flex flex-col">
          <span className="mb-1 text-[11px] font-medium text-gray-700">
            Asset Type
          </span>
          <div className="h-7 px-2 bg-slate-100 border border-slate-200 rounded-md text-[11px] text-slate-700 font-bold flex items-center truncate">
            {formData.assetType || "—"}
          </div>
        </div>

        <SearchSelect
          label="Mouja"
          name="mouja"
          value={formData.mouja}
          onChange={(name, value) => {
            handleChange({ target: { name, value } } as any);
            if (onMoujaChange) {
              onMoujaChange(value);
            }
          }}
          disabled={formData.isMovableCategory}
          options={
            moujas && moujas.length > 0
              ? moujas.map((m) => {
                const label = m.moujaName || `Mouja ${m.id}`;
                return { label, value: String(m.id) };
              })
              : []
          }
          placeholder="Select Mouja"
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("mouja" as any) ? (errors as any).mouja : undefined}
        />

        <SearchSelect
          label="Zone"
          name="zone"
          value={formData.zone}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          disabled={formData.isMovableCategory}
          options={
            zones && zones.length > 0
              ? zones.map((z) => {
                const label =
                  z.zoneName ||
                  z.ZoneName ||
                  z.zoneNo ||
                  `Zone ${z.id || ""}`;
                return { label, value: String(z.id) };
              })
              : [
                { label: "Zone 1", value: "1" },
                { label: "Zone 2", value: "2" },
                { label: "Zone 3", value: "3" },
                { label: "Zone 4", value: "4" },
                { label: "Zone 5", value: "5" },
              ]
          }
          placeholder="Select Zone"
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("zone") ? errors.zone : undefined}
        />

        <SearchSelect
          label="Ward"
          name="ward"
          value={formData.ward}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          disabled={formData.isMovableCategory || !formData.zone}
          options={
            wards && wards.length > 0
              ? wards
                .filter((w) => !formData.zone || w.zoneId == null || String(w.zoneId) === String(formData.zone))
                .map((w) => {
                  const label =
                    w.wardName ||
                    w.WardName ||
                    w.wardNo ||
                    `Ward ${w.id || ""}`;
                  return { label, value: String(w.id) };
                })
              : Array.from({ length: 20 }, (_, i) => ({
                label: `Ward ${i + 1}`,
                value: String(i + 1),
              }))
          }
          placeholder="Select Ward"
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("ward") ? errors.ward : undefined}
        />

        <SearchSelect
          label="Subzone"
          name="subzone"
          value={formData.subzone}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          disabled={formData.isMovableCategory || !formData.mouja || isLoadingSubzones}
          options={
            subzones && subzones.length > 0
              ? subzones.map((s) => {
                const label =
                  s.subZoneName ||
                  s.SubZoneName ||
                  s.subZoneNo ||
                  s.SubZoneNo ||
                  s.name ||
                  `Subzone ${s.id || ""}`;
                return { label, value: String(s.id || s.subZoneNo || s.SubZoneNo || "") };
              })
              : []
          }
          placeholder="Select Subzone"
          className="font-semibold text-sm"
          required={!formData.isMovableCategory}
          error={showError("subzone" as any) ? (errors as any).subzone : undefined}
        />

        <Input
          label={isLand ? "CSN No. / Survey Number" : "CSN No."}
          name="surveyNumber"
          value={formData.surveyNumber}
          onChange={handleChange}
          placeholder="e.g. CSN-123"
          disabled={formData.isMovableCategory}
          className="h-8 text-[13px]"
          error={showError("surveyNumber") ? errors.surveyNumber : undefined}
        />

        <div className="hidden">
          <Input
            label="Property No"
            name="propertyNumber"
            value={formData.propertyNumber}
            onChange={handleChange}
            placeholder="e.g. MC/WD15/2024/001"
            className="h-8 text-[13px]"
            required
            error={showError("propertyNumber") ? errors.propertyNumber : undefined}
          />
        </div>

        <SearchSelect
          label="Asset Condition"
          name="condition"
          value={formData.condition || "Good"}
          onChange={(name, value) => handleChange({ target: { name, value } } as any)}
          options={[
            { label: "Good", value: "Good" },
            { label: "Average", value: "Average" },
            { label: "Poor", value: "Poor" },
          ]}
          placeholder="Select Condition"
          className="font-semibold text-sm"
        />

        {
          (isLand || isBuilding) && (
            <>
              <Input
                label="Length (Sq. Mtr)"
                name="length"
                value={(formData as any).length || ""}
                onChange={handleChange}
                placeholder="0.00"
                type="text"
                className="h-8 text-[13px]"
                required
                error={showError("length" as any) ? (errors as any).length : undefined}
              />
              <Input
                label="Width (Sq. Mtr)"
                name="width"
                value={(formData as any).width || ""}
                onChange={handleChange}
                placeholder="0.00"
                type="text"
                className="h-8 text-[13px]"
                required
                error={showError("width" as any) ? (errors as any).width : undefined}
              />
              {isLand && (
                <>
                  <SearchSelect
                    label="Offset Operation"
                    name="offsetOp"
                    value={(formData as any).offsetOp || "Subtract"}
                    onChange={(name, value) => handleChange({ target: { name, value } } as any)}
                    options={[
                      { label: "Add", value: "Add" },
                      { label: "Subtract", value: "Subtract" },
                    ]}
                    placeholder="Select Offset Operation"
                    className="font-semibold text-sm"
                    required
                  />
                  <Input
                    label="Offset (Sq. Mtr)"
                    name="offset"
                    value={(formData as any).offset || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    type="text"
                    className="h-8 text-[13px]"
                    required
                    error={showError("offset" as any) ? (errors as any).offset : undefined}
                  />
                </>
              )}
              <Input
                label="Total Area (Sq. Mtr)"
                name="landArea"
                value={formData.landArea || ""}
                onChange={handleChange}
                placeholder="0.00"
                type="text"
                readOnly
                className="h-8 text-[13px] bg-slate-50 cursor-not-allowed"
                required
                error={showError("landArea" as any) ? (errors as any).landArea : undefined}
              />
            </>
          )
        }

        {
          isLand && (
            <>
              <Input
                label="Plot Number"
                name="plotNumber"
                value={(formData as any).plotNumber || ""}
                onChange={handleChange}
                placeholder="e.g. 15"
                className="h-8 text-[13px]"
                required
                error={showError("plotNumber" as any) ? (errors as any).plotNumber : undefined}
              />
              <SearchSelect
                label="Type of Use"
                name="typeOfUseId"
                value={(formData as any).typeOfUseId || ""}
                onChange={(name, value) => handleChange({ target: { name, value } } as any)}
                options={
                  useTypes && useTypes.length > 0
                    ? useTypes.map((ut) => ({
                      label: ut.description || ut.typeOfUseCode || `Use Type ${ut.typeOfUseId}`,
                      value: String(ut.typeOfUseId),
                    }))
                    : []
                }
                placeholder="Select Type of Use"
                className="font-semibold text-sm"
                required
                error={showError("typeOfUseId" as any) ? (errors as any).typeOfUseId : undefined}
              />
              <SearchSelect
                label="Sub Type of Use"
                name="subTypeOfUseId"
                value={(formData as any).subTypeOfUseId || ""}
                onChange={(name, value) => handleChange({ target: { name, value } } as any)}
                options={
                  subUseTypes && subUseTypes.length > 0
                    ? subUseTypes.map((sub) => ({
                      label: sub.description || `Sub Type ${sub.subTypeOfUseId}`,
                      value: String(sub.subTypeOfUseId),
                    }))
                    : []
                }
                placeholder="Select Sub Type of Use"
                className="font-semibold text-sm"
                disabled={!(formData as any).typeOfUseId || isLoadingSubTypes}
                required
                error={showError("subTypeOfUseId" as any) ? (errors as any).subTypeOfUseId : undefined}
              />
            </>
          )
        }
      </CardContent >
    </Card >
  );
}
